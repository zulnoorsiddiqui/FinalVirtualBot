using FinalVirtualBot.Server.Models;

namespace FinalVirtualBot.Server.Services
{
    public interface IDialogflowService
    {
        DialogflowResponse DetectIntent(string sessionId, string text);
    }
}
