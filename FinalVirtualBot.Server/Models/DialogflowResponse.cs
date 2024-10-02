namespace UserAuthentication.Models
{
    public class DialogflowResponse
    {
        public List<string> FulfillmentTexts { get; set; } // List of fulfillment messages
        public Dictionary<string, object> Payload { get; set; } // Custom payload
        public string IntentName { get; set; } // Intent information
    }
}
