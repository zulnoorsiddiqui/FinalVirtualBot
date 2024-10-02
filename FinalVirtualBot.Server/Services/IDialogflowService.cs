using UserAuthentication.Models;

namespace UserAuthentication.Services
{
    public interface IDialogflowService
    {
        DialogflowResponse DetectIntent(string sessionId, string text);
    }
}
