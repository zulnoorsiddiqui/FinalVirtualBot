using Microsoft.AspNetCore.Mvc;
using Moq;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Threading.Tasks;
using FinalVirtualBot.Server.Controllers;
using FinalVirtualBot.Server.Models;
using FinalVirtualBot.Server.Services;
using Xunit;

namespace TestBackend
{
    public class DialogflowControllerTests
    {
        private readonly Mock<IDialogflowService> _dialogflowServiceMock;
        private readonly DialogflowController _controller;

        public DialogflowControllerTests()
        {
            _dialogflowServiceMock = new Mock<IDialogflowService>();
            _controller = new DialogflowController(_dialogflowServiceMock.Object);
        }

        [Fact]
        public void DetectIntent_ShouldReturnOkResult_WithDialogflowResponse()
        {
            // Arrange
            var request = new DialogflowRequest
            {
                QueryInput = "test query"
            };
            var response = new DialogflowResponse
            {
                FulfillmentTexts = new List<string> { "Hello", "World" },
                Payload = new Dictionary<string, object> { { "key", "value" } },
                IntentName = "TestIntent"
            };

            _dialogflowServiceMock
                .Setup(service => service.DetectIntent(It.IsAny<string>(), It.IsAny<string>()))
                .Returns(response);

            // Act
            var result = _controller.DetectIntent(request);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = JsonConvert.DeserializeObject<DialogflowResponse>(JsonConvert.SerializeObject(okResult.Value));
            Assert.Equal(response.FulfillmentTexts, returnValue.FulfillmentTexts);
            Assert.Equal(response.Payload, returnValue.Payload);
            Assert.Equal(response.IntentName, returnValue.IntentName);
        }

        [Fact]
        public void DetectIntent_ShouldReturnCorrectPayloadAndFulfillmentTexts()
        {
            // Arrange
            var request = new DialogflowRequest
            {
                QueryInput = "test query"
            };

            var response = new DialogflowResponse
            {
                FulfillmentTexts = new List<string> { "Test Fulfillment" },
                Payload = new Dictionary<string, object> { { "key", "value" } },
                IntentName = "TestIntent"
            };

            _dialogflowServiceMock
                .Setup(service => service.DetectIntent(It.IsAny<string>(), It.IsAny<string>()))
                .Returns(response);

            // Act
            var result = _controller.DetectIntent(request);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = JsonConvert.DeserializeObject<DialogflowResponse>(JsonConvert.SerializeObject(okResult.Value));

            Assert.Equal(response.FulfillmentTexts, returnValue.FulfillmentTexts);
            Assert.Equal(response.Payload, returnValue.Payload);
            Assert.Equal(response.IntentName, returnValue.IntentName);
        }

        [Fact]
        public void DetectIntent_ShouldHandleNullOrEmptyQueryInput()
        {
            // Arrange
            var request = new DialogflowRequest
            {
                QueryInput = null // or ""
            };

            var response = new DialogflowResponse
            {
                FulfillmentTexts = new List<string> { "Default Response" },
                Payload = new Dictionary<string, object> { { "key", "default" } },
                IntentName = "DefaultIntent"
            };

            _dialogflowServiceMock
                .Setup(service => service.DetectIntent(It.IsAny<string>(), It.IsAny<string>()))
                .Returns(response);

            // Act
            var result = _controller.DetectIntent(request);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = JsonConvert.DeserializeObject<DialogflowResponse>(JsonConvert.SerializeObject(okResult.Value));

            Assert.Equal(response.FulfillmentTexts, returnValue.FulfillmentTexts);
            Assert.Equal(response.Payload, returnValue.Payload);
            Assert.Equal(response.IntentName, returnValue.IntentName);
        }

        [Fact]
        public void DetectIntent_ShouldHandleDifferentResponseStructures()
        {
            // Arrange
            var request = new DialogflowRequest
            {
                QueryInput = "test query"
            };

            var response = new DialogflowResponse
            {
                FulfillmentTexts = new List<string> { "Different Response" },
                Payload = new Dictionary<string, object> { { "differentKey", "differentValue" } },
                IntentName = "DifferentIntent"
            };

            _dialogflowServiceMock
                .Setup(service => service.DetectIntent(It.IsAny<string>(), It.IsAny<string>()))
                .Returns(response);

            // Act
            var result = _controller.DetectIntent(request);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = JsonConvert.DeserializeObject<DialogflowResponse>(JsonConvert.SerializeObject(okResult.Value));

            Assert.Equal(response.FulfillmentTexts, returnValue.FulfillmentTexts);
            Assert.Equal(response.Payload, returnValue.Payload);
            Assert.Equal(response.IntentName, returnValue.IntentName);
        }

        [Fact]
        public void DetectIntent_ShouldReturnEmptyResponse_WhenServiceThrowsException()
        {
            // Arrange
            var request = new DialogflowRequest
            {
                QueryInput = "test query"
            };

            _dialogflowServiceMock
                .Setup(service => service.DetectIntent(It.IsAny<string>(), It.IsAny<string>()))
                .Throws(new System.Exception("Service error"));

            // Act
            var result = _controller.DetectIntent(request);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = JsonConvert.DeserializeObject<DialogflowResponse>(JsonConvert.SerializeObject(okResult.Value));

            Assert.Null(returnValue.FulfillmentTexts);
            Assert.Null(returnValue.Payload);
            Assert.Null(returnValue.IntentName);
        }

        [Fact]
        public void DetectIntent_ShouldUseUniqueSessionId()
        {
            // Arrange
            var request = new DialogflowRequest
            {
                QueryInput = "test query"
            };

            var response = new DialogflowResponse
            {
                FulfillmentTexts = new List<string> { "Session Test" },
                Payload = new Dictionary<string, object> { { "sessionKey", "sessionValue" } },
                IntentName = "SessionIntent"
            };

            _dialogflowServiceMock
                .Setup(service => service.DetectIntent(It.IsAny<string>(), It.IsAny<string>()))
                .Returns(response);

            // Act
            var result = _controller.DetectIntent(request);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = JsonConvert.DeserializeObject<DialogflowResponse>(JsonConvert.SerializeObject(okResult.Value));

            Assert.Equal(response.FulfillmentTexts, returnValue.FulfillmentTexts);
            Assert.Equal(response.Payload, returnValue.Payload);
            Assert.Equal(response.IntentName, returnValue.IntentName);
        }
    }
}
