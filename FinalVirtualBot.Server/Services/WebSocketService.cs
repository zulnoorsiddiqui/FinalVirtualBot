using System.Net.WebSockets;
using System.Threading.Tasks;
using System.Collections.Concurrent;

namespace FinalVirtualBot.Server.Services
{
    public class WebSocketService
    {
        private static readonly Lazy<WebSocketService> _instance =
            new Lazy<WebSocketService>(() => new WebSocketService());
        private ConcurrentDictionary<string, WebSocket> _clients;

        private WebSocketService()
        {
            _clients = new ConcurrentDictionary<string, WebSocket>();
        }

        public static WebSocketService Instance => _instance.Value;

        public void AddClient(string sessionId, WebSocket socket)
        {
            _clients[sessionId] = socket;
        }

        public WebSocket GetClient(string sessionId)
        {
            _clients.TryGetValue(sessionId, out var socket);
            return socket;
        }

        public void RemoveClient(string sessionId)
        {
            _clients.TryRemove(sessionId, out _);
        }
    }
}
