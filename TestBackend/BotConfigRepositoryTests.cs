using Moq;

using Microsoft.Extensions.DependencyInjection;
using System;
using FinalVirtualBot.Server.Repository;
using FinalVirtualBot.Server.Models;


namespace TestBackend
{
    public class BotConfigRepositoryTests
    {
        private readonly ServiceProvider _serviceProvider;
        private readonly Mock<IBotConfigRepository> _mockRepo;

        public BotConfigRepositoryTests()
        {
            // Set up the service collection and inject dependencies
            var services = new ServiceCollection();

            // Use Moq to mock the IBotConfigRepository
            _mockRepo = new Mock<IBotConfigRepository>();

            // Sample data
            var botConfigs = new List<BotConfig>
        {
            new BotConfig { Id = "1", BotName = "TestBot1" },
            new BotConfig { Id = "2", BotName = "TestBot2" }
        };

            // Mock the repository methods
            _mockRepo.Setup(repo => repo.GetAllAsync()).ReturnsAsync(botConfigs);
            _ = _mockRepo.Setup(repo => repo.GetByIdAsync(It.IsAny<string>()))
                .ReturnsAsync((string id) => botConfigs.Find(b => b.Id == id));
            _mockRepo.Setup(repo => repo.CreateAsync(It.IsAny<BotConfig>()))
                .Callback<BotConfig>(botConfig => botConfigs.Add(botConfig))
                .Returns(Task.CompletedTask);
            _mockRepo.Setup(repo => repo.UpdateAsync(It.IsAny<string>(), It.IsAny<BotConfig>()))
                .Callback<string, BotConfig>((id, updatedBot) =>
                {
                    var existingBot = botConfigs.Find(b => b.Id == id);
                    if (existingBot != null)
                    {
                        existingBot.BotName = updatedBot.BotName;
                    }
                })
                .Returns(Task.CompletedTask);
            _mockRepo.Setup(repo => repo.DeleteAsync(It.IsAny<string>()))
                .Callback<string>(id => botConfigs.RemoveAll(b => b.Id == id))
                .Returns(Task.CompletedTask);

            // Register the mocked repository in the service collection
            services.AddScoped(_ => _mockRepo.Object);

            // Build the service provider
            _serviceProvider = services.BuildServiceProvider();
        }

        [Fact]
        public async Task GetAllAsync_ReturnsListOfBotConfigs()
        {
            // Resolve the service from the service provider
            var repo = _serviceProvider.GetRequiredService<IBotConfigRepository>();

            // Act
            var result = await repo.GetAllAsync();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Equal("TestBot1", result[0].BotName);
        }

        [Fact]
        public async Task GetByIdAsync_ReturnsCorrectBotConfig()
        {
            // Resolve the service from the service provider
            var repo = _serviceProvider.GetRequiredService<IBotConfigRepository>();

            // Act
            var result = await repo.GetByIdAsync("1");

            // Assert
            Assert.NotNull(result);
            Assert.Equal("TestBot1", result.BotName);
        }

        [Fact]
        public async Task GetByIdAsync_ReturnsNullWhenNotFound()
        {
            // Resolve the service from the service provider
            var repo = _serviceProvider.GetRequiredService<IBotConfigRepository>();

            // Act
            var result = await repo.GetByIdAsync("3"); // ID not in the list

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task CreateAsync_AddsNewBotConfig()
        {
            // Resolve the service from the service provider
            var repo = _serviceProvider.GetRequiredService<IBotConfigRepository>();

            // Act
            var newBotConfig = new BotConfig { Id = "3", BotName = "TestBot3" };
            await repo.CreateAsync(newBotConfig);

            // Assert
            _mockRepo.Verify(r => r.CreateAsync(It.IsAny<BotConfig>()), Times.Once);
            var result = await repo.GetAllAsync();
            Assert.Equal(3, result.Count);
            Assert.Equal("TestBot3", result[2].BotName);
        }

        [Fact]
        public async Task UpdateAsync_UpdatesExistingBotConfig()
        {
            // Resolve the service from the service provider
            var repo = _serviceProvider.GetRequiredService<IBotConfigRepository>();

            // Act
            var updatedBotConfig = new BotConfig { Id = "1", BotName = "UpdatedBot" };
            await repo.UpdateAsync("1", updatedBotConfig);

            // Assert
            _mockRepo.Verify(r => r.UpdateAsync("1", updatedBotConfig), Times.Once);
            var result = await repo.GetByIdAsync("1");
            Assert.Equal("UpdatedBot", result.BotName);
        }

        [Fact]
        public async Task DeleteAsync_RemovesBotConfig()
        {
            // Resolve the service from the service provider
            var repo = _serviceProvider.GetRequiredService<IBotConfigRepository>();

            // Act
            await repo.DeleteAsync("1");

            // Assert
            _mockRepo.Verify(r => r.DeleteAsync("1"), Times.Once);
            var result = await repo.GetByIdAsync("1");
            Assert.Null(result);
        }
    }
}