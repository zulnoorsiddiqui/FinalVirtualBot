using System;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Moq;
using Xunit;

using FinalVirtualBot.Server.Services;

namespace TestBackend
{
    public class WebSocketServiceTests
    {
        private readonly TestServer _server;
        private readonly WebSocketClient _client;
        private readonly WebSocketService _webSocketService;

        public WebSocketServiceTests()
        {
            _webSocketService = WebSocketService.Instance;

            var hostBuilder = Host.CreateDefaultBuilder()
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseTestServer();

                    webBuilder.ConfigureServices(services =>
                    {
                        // You can add services here if needed
                    });

                    webBuilder.Configure(app =>
                    {
                        app.UseWebSockets();
                        app.UseRouting();

                        // Setup WebSocket endpoint for test
                        app.UseEndpoints(endpoints =>
                        {
                            endpoints.Map("/ws", async context =>
                            {
                                if (context.WebSockets.IsWebSocketRequest)
                                {
                                    var webSocket = await context.WebSockets.AcceptWebSocketAsync();
                                    await HandleWebSocketConnection(webSocket);
                                }
                                else
                                {
                                    context.Response.StatusCode = 400;
                                }
                            });
                        });
                    });
                });

            var host = hostBuilder.Start();
            _server = host.GetTestServer();
            _client = _server.CreateWebSocketClient();
        }

        // Helper method to handle WebSocket communication
        private async Task HandleWebSocketConnection(WebSocket webSocket)
        {
            var sessionId = "testSessionId";
            WebSocketService.Instance.AddClient(sessionId, webSocket);

            var buffer = new byte[1024 * 4];
            var result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

            while (!result.CloseStatus.HasValue)
            {
                // Simulate backend response or Dialogflow response for testing
                var serverMessage = Encoding.UTF8.GetBytes("HelloIntent");
                await webSocket.SendAsync(new ArraySegment<byte>(serverMessage), WebSocketMessageType.Text, true, CancellationToken.None);
                result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
            }

            await webSocket.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, CancellationToken.None);
            WebSocketService.Instance.RemoveClient(sessionId);
        }

        [Fact]
        public async Task WebSocket_ShouldAddAndRemoveClientSuccessfully()
        {
            // Arrange
            var mockWebSocket = new Mock<WebSocket>();
            var sessionId = "testSessionId";
            var wsUri = new Uri("ws://localhost/ws");

            // Setup mock WebSocket behavior
            mockWebSocket.Setup(ws => ws.ReceiveAsync(It.IsAny<ArraySegment<byte>>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new WebSocketReceiveResult(0, WebSocketMessageType.Text, true));
            mockWebSocket.Setup(ws => ws.SendAsync(It.IsAny<ArraySegment<byte>>(), It.IsAny<WebSocketMessageType>(), It.IsAny<bool>(), It.IsAny<CancellationToken>()))
                .Returns(Task.CompletedTask);
            mockWebSocket.Setup(ws => ws.CloseAsync(It.IsAny<WebSocketCloseStatus>(), It.IsAny<string>(), It.IsAny<CancellationToken>()))
                .Returns(Task.CompletedTask);

            // Act
            WebSocketService.Instance.AddClient(sessionId, mockWebSocket.Object);

            // Assert
            var addedSocket = WebSocketService.Instance.GetClient(sessionId);
            addedSocket.Should().NotBeNull();
            addedSocket.Should().Be(mockWebSocket.Object);

            // Remove client
            WebSocketService.Instance.RemoveClient(sessionId);

            // Assert removal
            var removedSocket = WebSocketService.Instance.GetClient(sessionId);
            removedSocket.Should().BeNull();
        }

        [Fact]
        public async Task WebSocket_ShouldHandleConnectionFailure()
        {
            // Arrange
            var invalidUri = new Uri("ws://localhost/invalid");

            // Act
            Func<Task> connectAction = async () => await _client.ConnectAsync(invalidUri, CancellationToken.None);

            // Assert
            await connectAction.Should().ThrowAsync<InvalidOperationException>()
                .WithMessage("incomplete handshake, status code: 404");

            // Verify that no client was added to the invalid connection
            var client = WebSocketService.Instance.GetClient("testSessionId");
            client.Should().BeNull();
        }

        [Fact]
        public async Task WebSocket_ShouldHandleMultipleClients()
        {
            // Arrange
            var mockWebSocket1 = new Mock<WebSocket>();
            var mockWebSocket2 = new Mock<WebSocket>();

            var sessionId1 = "zulnoorSession1";
            var sessionId2 = "siddiquiSessions2";
            var wsUri = new Uri("ws://localhost/ws");

            // Setup mock WebSocket behaviors, these all are behaviours (received,send,close)
            mockWebSocket1.Setup(ws => ws.ReceiveAsync(It.IsAny<ArraySegment<byte>>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new WebSocketReceiveResult(0, WebSocketMessageType.Text, true));
            mockWebSocket1.Setup(ws => ws.SendAsync(It.IsAny<ArraySegment<byte>>(), It.IsAny<WebSocketMessageType>(), It.IsAny<bool>(), It.IsAny<CancellationToken>()))
                .Returns(Task.CompletedTask);
            mockWebSocket1.Setup(ws => ws.CloseAsync(It.IsAny<WebSocketCloseStatus>(), It.IsAny<string>(), It.IsAny<CancellationToken>()))
                .Returns(Task.CompletedTask);

            mockWebSocket2.Setup(ws => ws.ReceiveAsync(It.IsAny<ArraySegment<byte>>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new WebSocketReceiveResult(0, WebSocketMessageType.Text, true));
            mockWebSocket2.Setup(ws => ws.SendAsync(It.IsAny<ArraySegment<byte>>(), It.IsAny<WebSocketMessageType>(), It.IsAny<bool>(), It.IsAny<CancellationToken>()))
                .Returns(Task.CompletedTask);
            mockWebSocket2.Setup(ws => ws.CloseAsync(It.IsAny<WebSocketCloseStatus>(), It.IsAny<string>(), It.IsAny<CancellationToken>()))
                .Returns(Task.CompletedTask);

            // Act
            WebSocketService.Instance.AddClient(sessionId1, mockWebSocket1.Object);
            WebSocketService.Instance.AddClient(sessionId2, mockWebSocket2.Object);

            // Assert
            var addedSocket1 = WebSocketService.Instance.GetClient(sessionId1);
            var addedSocket2 = WebSocketService.Instance.GetClient(sessionId2);

            addedSocket1.Should().NotBeNull();
            addedSocket1.Should().Be(mockWebSocket1.Object);

            addedSocket2.Should().NotBeNull();
            addedSocket2.Should().Be(mockWebSocket2.Object);

            // Act: Remove both clients
            WebSocketService.Instance.RemoveClient(sessionId1);
            WebSocketService.Instance.RemoveClient(sessionId2);

            // Assert: Verify that both clients are removed
            var removedSocket1 = WebSocketService.Instance.GetClient(sessionId1);
            var removedSocket2 = WebSocketService.Instance.GetClient(sessionId2);

            removedSocket1.Should().BeNull();
            removedSocket2.Should().BeNull();
        }
    }
}
