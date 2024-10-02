using Microsoft.AspNetCore.Mvc;
using UserAuthentication.Services;
using UserAuthentication.Models;

namespace UserAuthentication.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DialogflowController : ControllerBase
    {
        private readonly IDialogflowService _dialogflowService;

        public DialogflowController(IDialogflowService dialogflowService)
        {
            _dialogflowService = dialogflowService;
        }

        [HttpPost("detect-intent")]
        public IActionResult DetectIntent([FromBody] DialogflowRequest request)
        {
            if (string.IsNullOrEmpty(request?.QueryInput))
            {
                return BadRequest("QueryInput cannot be null or empty.");
            }

            var sessionId = "test-session"; // Ideally, use a unique session ID per user/session

            // Get the response from the Dialogflow service
            var response = _dialogflowService.DetectIntent(sessionId, request.QueryInput);

            if (response == null)
            {
                return StatusCode(500, "Dialogflow service returned null.");
            }

            // Return the aggregated response with null checks for each property
            return Ok(new
            {
                FulfillmentTexts = response.FulfillmentTexts ?? new List<string>(),
                Payload = response.Payload ?? new Dictionary<string, object>(),
                IntentName = response.IntentName ?? "Unknown Intent"
            });
        }
    }
}
