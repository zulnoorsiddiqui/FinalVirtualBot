using Xunit;
using Moq;
using Google.Cloud.Dialogflow.V2;
using FinalVirtualBot.Server.Models;
using FinalVirtualBot.Server.Services;
using FluentAssertions;
using System.Collections.Generic;
using Google.Protobuf.WellKnownTypes;
using Google.Protobuf.Collections;
using System;
using Grpc.Core;
using Newtonsoft.Json.Linq;
using Xunit.Abstractions;

namespace TestBackend
{
    public class DialogflowServiceTests
    {
        private readonly Mock<SessionsClient> _mockSessionsClient;
        private readonly string _projectId = "task-agent-xoqj";
        private readonly string _sessionId = "test-session-id";
        private readonly DialogflowService _dialogflowService;

        public DialogflowServiceTests()
        {
            // Initialize the mock SessionsClient
            _mockSessionsClient = new Mock<SessionsClient>();

            // Create a DialogflowService using the mock SessionsClient
            _dialogflowService = new DialogflowService(_projectId, @"C:\Users\Interact CX\Downloads\credential.json");

            // Use reflection to set the internal SessionsClient in the DialogflowService for testing
            var clientField = typeof(DialogflowService).GetField("_sessionsClient", System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance);
            clientField.SetValue(_dialogflowService, _mockSessionsClient.Object);
        }

        [Fact]
        public void DetectIntent_ShouldReturnDialogflowResponse_WithFulfillmentMessages()
        {
            // Arrange
            var expectedFulfillmentTexts = new List<string> { "Response 1", "Response 2" };

            var mockQueryResult = new QueryResult
            {
                FulfillmentMessages =
                {
                    new Intent.Types.Message
                    {
                        Text = new Intent.Types.Message.Types.Text
                        {
                            Text_ = { expectedFulfillmentTexts }
                        }
                    }
                },
                Intent = new Intent { DisplayName = "TestIntent" }
            };

            var mockResponse = new DetectIntentResponse { QueryResult = mockQueryResult };

            // Setup the mock to return the mock response
            _mockSessionsClient
                .Setup(x => x.DetectIntent(It.IsAny<SessionName>(), It.IsAny<QueryInput>(), null))
                .Returns(mockResponse);

            // Act
            var result = _dialogflowService.DetectIntent(_sessionId, "Hello");

            // Assert
            result.Should().NotBeNull();
            result.FulfillmentTexts.Should().BeEquivalentTo(expectedFulfillmentTexts);
            result.IntentName.Should().Be("TestIntent");

        }

        [Fact]
        public void DetectIntent_ShouldReturnDialogflowResponse_WithCustomPayload()
        {
            // Arrange
            var customPayload = new MapField<string, Value>
            {
                { "key1", Value.ForString("value1") },
                { "key2", Value.ForNumber(123) }
            };

            var mockQueryResult = new QueryResult
            {
                FulfillmentMessages =
                {
                    new Intent.Types.Message
                    {
                        Payload = new Struct
                        {
                            Fields = { customPayload }
                        }
                    }
                },
                Intent = new Intent { DisplayName = "TestIntent" }
            };

            var mockResponse = new DetectIntentResponse { QueryResult = mockQueryResult };

            // Setup the mock to return the mock response
            _mockSessionsClient
                .Setup(x => x.DetectIntent(It.IsAny<SessionName>(), It.IsAny<QueryInput>(), null))
                .Returns(mockResponse);

            // Act
            var result = _dialogflowService.DetectIntent(_sessionId, "Hello");

            // Assert
            result.Should().NotBeNull();
            result.Payload.Should().ContainKey("key1");
            result.Payload["key1"].Should().BeOfType<string>().Which.Should().Be("value1");

            result.Payload.Should().ContainKey("key2");
            result.Payload["key2"].Should().BeOfType<double>().Which.Should().Be(123);


        }

        [Fact]
        public void DetectIntent_ShouldHandleNoFulfillmentMessages()
        {
            // Arrange
            var mockQueryResult = new QueryResult
            {
                FulfillmentMessages = { }, // No fulfillment messages
                Intent = new Intent { DisplayName = "TestIntent" }
            };

            var mockResponse = new DetectIntentResponse { QueryResult = mockQueryResult };

            // Setup the mock to return the mock response
            _mockSessionsClient
                .Setup(x => x.DetectIntent(It.IsAny<SessionName>(), It.IsAny<QueryInput>(), null))
                .Returns(mockResponse);

            // Act
            var result = _dialogflowService.DetectIntent(_sessionId, "Hello");

            // Assert
            result.Should().NotBeNull();
            result.FulfillmentTexts.Should().BeEmpty();
            result.IntentName.Should().Be("TestIntent");
        }

        [Fact]
        public void DetectIntent_ShouldThrowException_WhenDetectIntentFails()
        {
            // Arrange
            _mockSessionsClient
                .Setup(x => x.DetectIntent(It.IsAny<SessionName>(), It.IsAny<QueryInput>(), null))
                .Throws(new RpcException(new Grpc.Core.Status(Grpc.Core.StatusCode.Unknown, "Failure")));

            // Act
            Action act = () => _dialogflowService.DetectIntent(_sessionId, "Hello");

            // Assert
            act.Should().Throw<InvalidOperationException>()
                .WithMessage("Failed to detect intent.");
        }
    }
}
