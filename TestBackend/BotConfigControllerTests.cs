using Microsoft.AspNetCore.Mvc;
using Moq;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Threading.Tasks;

using Xunit;
using FinalVirtualBot.Server.Controllers;
using FinalVirtualBot.Server.Repository;
using FinalVirtualBot.Server.Models;
using FinalVirtualBot.Server.Dtos;

namespace TestBackend
{
    public class BotConfigControllerTests
    {
        private readonly Mock<IBotConfigRepository> _botConfigRepositoryMock;
        private readonly BotConfigController _controller;

        public BotConfigControllerTests()
        {
            _botConfigRepositoryMock = new Mock<IBotConfigRepository>();
            _controller = new BotConfigController(_botConfigRepositoryMock.Object);
        }

        [Fact]
        public async Task GetAll_ShouldReturnOkResult_WithListOfBotConfigDTO()
        {
            // Arrange
            var botConfigs = new List<BotConfig>
            {
                new BotConfig { Id = "1", BotName = "Bot1", Provider = "Provider1", ConfigVersion = "1.0", JsonServiceAccount = "Account1", Region = "Region1", Language = "en" },
                new BotConfig { Id = "2", BotName = "Bot2", Provider = "Provider2", ConfigVersion = "1.1", JsonServiceAccount = "Account2", Region = "Region2", Language = "fr" }
            };
            var botConfigDtos = botConfigs.ConvertAll(bc => new BotConfigDTO
            {
                BotName = bc.BotName,
                Provider = bc.Provider,
                ConfigVersion = bc.ConfigVersion,
                JsonServiceAccount = bc.JsonServiceAccount,
                Region = bc.Region,
                Language = bc.Language
            });

            _botConfigRepositoryMock.Setup(repo => repo.GetAllAsync()).ReturnsAsync(botConfigs);

            // Act
            var result = await _controller.GetAll();

            // Assert
            var objectResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<List<BotConfigDTO>>(objectResult.Value);
            Assert.Equal(botConfigDtos.Count, returnValue.Count);
            for (int i = 0; i < botConfigDtos.Count; i++)
            {
                Assert.Equal(botConfigDtos[i].BotName, returnValue[i].BotName);
                Assert.Equal(botConfigDtos[i].Provider, returnValue[i].Provider);
                Assert.Equal(botConfigDtos[i].ConfigVersion, returnValue[i].ConfigVersion);
                Assert.Equal(botConfigDtos[i].JsonServiceAccount, returnValue[i].JsonServiceAccount);
                Assert.Equal(botConfigDtos[i].Region, returnValue[i].Region);
                Assert.Equal(botConfigDtos[i].Language, returnValue[i].Language);
            }
        }

        [Fact]
        public async Task GetById_ShouldReturnOkResult_WithBotConfigDTO_WhenBotConfigExists()
        {
            // Arrange
            var botConfig = new BotConfig
            {
                Id = "1",
                BotName = "Bot1",
                Provider = "Provider1",
                ConfigVersion = "1.0",
                JsonServiceAccount = "Account1",
                Region = "Region1",
                Language = "en"
            };
            var botConfigDto = new BotConfigDTO
            {
                BotName = botConfig.BotName,
                Provider = botConfig.Provider,
                ConfigVersion = botConfig.ConfigVersion,
                JsonServiceAccount = botConfig.JsonServiceAccount,
                Region = botConfig.Region,
                Language = botConfig.Language
            };

            _botConfigRepositoryMock.Setup(repo => repo.GetByIdAsync("1")).ReturnsAsync(botConfig);

            // Act
            var result = await _controller.GetById("1");

            // Assert
            //var actionResult = Assert.IsType<ActionResult<BotConfigDTO>>(result);
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnValue = Assert.IsType<BotConfig>(okResult.Value);
            Assert.Equal(botConfigDto.BotName, returnValue.BotName);
            Assert.Equal(botConfigDto.Provider, returnValue.Provider);
            Assert.Equal(botConfigDto.ConfigVersion, returnValue.ConfigVersion);
            Assert.Equal(botConfigDto.JsonServiceAccount, returnValue.JsonServiceAccount);
            Assert.Equal(botConfigDto.Region, returnValue.Region);
            Assert.Equal(botConfigDto.Language, returnValue.Language);
        }

        [Fact]
        public async Task GetById_ShouldReturnNotFound_WhenBotConfigDoesNotExist()
        {
            // Arrange
            _botConfigRepositoryMock.Setup(repo => repo.GetByIdAsync("1")).ReturnsAsync((BotConfig)null);

            // Act
            var result = await _controller.GetById("1");

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task Create_ShouldReturnCreatedResult_WithBotConfigDTO()
        {
            // Arrange
            var botConfigDto = new BotConfigDTO
            {
                BotName = "NewBot",
                Provider = "NewProvider",
                ConfigVersion = "2.0",
                JsonServiceAccount = "NewAccount",
                Region = "NewRegion",
                Language = "fr"
            };
            var botConfig = new BotConfig
            {
                Id = "new_id",
                BotName = botConfigDto.BotName,
                Provider = botConfigDto.Provider,
                ConfigVersion = botConfigDto.ConfigVersion,
                JsonServiceAccount = botConfigDto.JsonServiceAccount,
                Region = botConfigDto.Region,
                Language = botConfigDto.Language
            };

            _botConfigRepositoryMock.Setup(repo => repo.CreateAsync(It.IsAny<BotConfig>())).Returns(Task.CompletedTask);
            _botConfigRepositoryMock.Setup(repo => repo.GetByIdAsync("new_id")).ReturnsAsync(botConfig);

            // Act
            var result = await _controller.Create(botConfigDto);

            // Assert
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result);
            var response = JsonConvert.DeserializeObject<Dictionary<string, object>>(JsonConvert.SerializeObject(createdAtActionResult.Value));
            //var response = Assert.IsType<dynamic>(createdAtActionResult.Value); // Use dynamic to handle anonymous type
            object responseBotConfig = null;
            response.TryGetValue("BotConfig", out responseBotConfig);
            //var responseMessage = (string)response.Message;
            //var responseBotConfig = response.BotConfig;

            //Assert.Equal("Bot configuration created successfully.", responseMessage);

            var returnValue = JsonConvert.DeserializeObject<BotConfig>(JsonConvert.SerializeObject(responseBotConfig));
            Assert.Equal(botConfig.BotName, returnValue.BotName);
            Assert.Equal(botConfig.Provider, returnValue.Provider);
            Assert.Equal(botConfig.ConfigVersion, returnValue.ConfigVersion);
            Assert.Equal(botConfig.JsonServiceAccount, returnValue.JsonServiceAccount);
            Assert.Equal(botConfig.Region, returnValue.Region);
            Assert.Equal(botConfig.Language, returnValue.Language);
        }

        [Fact]
        public async Task Update_ShouldReturnNoContent_WhenBotConfigExists()
        {
            // Arrange
            var botConfigDto = new BotConfigDTO
            {
                BotName = "UpdatedBot",
                Provider = "UpdatedProvider",
                ConfigVersion = "2.0",
                JsonServiceAccount = "UpdatedAccount",
                Region = "UpdatedRegion",
                Language = "es"
            };
            var existingBotConfig = new BotConfig
            {
                Id = "1",
                BotName = "OldBot",
                Provider = "OldProvider",
                ConfigVersion = "1.0",
                JsonServiceAccount = "OldAccount",
                Region = "OldRegion",
                Language = "en"
            };

            _botConfigRepositoryMock.Setup(repo => repo.GetByIdAsync("1")).ReturnsAsync(existingBotConfig);
            _botConfigRepositoryMock.Setup(repo => repo.UpdateAsync("1", It.IsAny<BotConfig>())).Returns(Task.CompletedTask);

            // Act
            var result = await _controller.Update("1", botConfigDto);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task Update_ShouldReturnNotFound_WhenBotConfigDoesNotExist()
        {
            // Arrange
            var botConfigDto = new BotConfigDTO
            {
                BotName = "UpdatedBot",
                Provider = "UpdatedProvider",
                ConfigVersion = "2.0",
                JsonServiceAccount = "UpdatedAccount",
                Region = "UpdatedRegion",
                Language = "es"
            };
            _botConfigRepositoryMock.Setup(repo => repo.GetByIdAsync("1")).ReturnsAsync((BotConfig)null);

            // Act
            var result = await _controller.Update("1", botConfigDto);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task Delete_ShouldReturnNoContent_WhenBotConfigExists()
        {
            // Arrange
            var botConfig = new BotConfig
            {
                Id = "1",
                BotName = "BotToDelete",
                Provider = "Provider",
                ConfigVersion = "1.0",
                JsonServiceAccount = "Account",
                Region = "Region",
                Language = "en"
            };

            _botConfigRepositoryMock.Setup(repo => repo.GetByIdAsync("1")).ReturnsAsync(botConfig);
            _botConfigRepositoryMock.Setup(repo => repo.DeleteAsync("1")).Returns(Task.CompletedTask);

            // Act
            var result = await _controller.Delete("1");

            // Assert
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task Delete_ShouldReturnNotFound_WhenBotConfigDoesNotExist()
        {
            // Arrange
            _botConfigRepositoryMock.Setup(repo => repo.GetByIdAsync("1")).ReturnsAsync((BotConfig)null);

            // Act
            var result = await _controller.Delete("1");

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }
    }
}
