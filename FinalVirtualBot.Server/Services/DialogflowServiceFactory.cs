namespace FinalVirtualBot.Server.Services
{
    public static class DialogflowServiceFactory
    {
        public static IDialogflowService Create(string projectId)
        {
            var credentialsPath = @"Credential.json"; // Adjust the path as needed
            return new DialogflowService(projectId, credentialsPath);
        }
    }
}
