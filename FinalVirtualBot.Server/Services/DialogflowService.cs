using Google.Cloud.Dialogflow.V2;
using Google.Apis.Auth.OAuth2;
using Google.Api.Gax.Grpc;
using Grpc.Auth;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;
using Google.Protobuf.WellKnownTypes;
using Google.Protobuf.Collections;
using FinalVirtualBot.Server.Models;
using System;

namespace FinalVirtualBot.Server.Services
{
    public class DialogflowService : IDialogflowService
    {
        private readonly SessionsClient _sessionsClient;
        private readonly string _projectId;

        public DialogflowService(string projectId, string credentialsPath)
        {
            // Create channel credentials from the provided credentials file
            var channelCredentials = GoogleCredential.FromFile(credentialsPath)
                .CreateScoped(SessionsClient.DefaultScopes)
                .ToChannelCredentials();

            // Initialize SessionsClient with the channel credentials
            _sessionsClient = new SessionsClientBuilder
            {
                ChannelCredentials = channelCredentials
            }.Build();

            _projectId = projectId;
        }

        // Detects the intent of a given text input within a specific session
        public DialogflowResponse DetectIntent(string sessionId, string text)
        {
            var session = SessionName.FromProjectSession(_projectId, sessionId);
            var queryInput = new QueryInput
            {
                Text = new TextInput
                {
                    Text = text,
                    LanguageCode = "en"
                }
            };

            try
            {
                var response = _sessionsClient.DetectIntent(session, queryInput);

                var fulfillmentTexts = response.QueryResult.FulfillmentMessages
                    .Where(m => m.Text != null)
                    .SelectMany(m => m.Text.Text_)
                    .ToList();

                var customPayload = response.QueryResult.FulfillmentMessages
                    .FirstOrDefault(m => m.Payload != null)?.Payload?.Fields;

                var payloadDictionary = customPayload != null
                    ? ConvertPayloadToDictionary(customPayload)
                    : null;

                var intentName = response.QueryResult.Intent.DisplayName;

                return new DialogflowResponse
                {
                    FulfillmentTexts = fulfillmentTexts,
                    Payload = payloadDictionary,
                    IntentName = intentName
                };
            }
            catch (Exception ex)
            {
                // Handle exceptions and provide meaningful error handling
                throw new InvalidOperationException("Failed to detect intent.", ex);
            }
        }

        // Optional method for setting SessionsClient, currently not used
        public void SetSessionsClient(SessionsClient client)
        {
            // Consider implementing this method if needed for testing or dependency injection
            //throw new NotImplementedException();
        }

        private Dictionary<string, object> ConvertPayloadToDictionary(MapField<string, Value> fields)
        {
            var result = new Dictionary<string, object>();
            foreach (var field in fields)
            {
                result[field.Key] = ConvertValue(field.Value);
            }
            return result;
        }

        private object ConvertValue(Value value)
        {
            switch (value.KindCase)
            {
                case Value.KindOneofCase.StringValue:
                    return value.StringValue;
                case Value.KindOneofCase.NumberValue:
                    return value.NumberValue;
                case Value.KindOneofCase.BoolValue:
                    return value.BoolValue;
                case Value.KindOneofCase.StructValue:
                    return ConvertPayloadToDictionary(value.StructValue.Fields);
                case Value.KindOneofCase.ListValue:
                    return value.ListValue.Values.Select(ConvertValue).ToList();
                default:
                    return null;
            }
        }
    }
}
