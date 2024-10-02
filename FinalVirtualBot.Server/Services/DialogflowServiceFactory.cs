namespace UserAuthentication.Services
{
    public static class DialogflowServiceFactory
    {
        public static IDialogflowService Create(string projectId)
        {
            var credentialsPath = @"C:\Users\Interact CX\Downloads\credential.json"; // Adjust the path as needed
            return new DialogflowService(projectId, credentialsPath);
        }
    }
}
