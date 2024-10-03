namespace UserAuthentication.Repository
{
    using FinalVirtualBot.Server.Models;
    using FinalVirtualBot.Server.Repository;
    using MongoDB.Driver;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    public class BotConfigRepository : IBotConfigRepository
    {
        private readonly IMongoCollection<BotConfig> _botConfigCollection;

        public BotConfigRepository(IMongoClient mongoClient)
        {
            var database = mongoClient.GetDatabase("BotsData");
            _botConfigCollection = database.GetCollection<BotConfig>("BotConfigs");
        }

        public async Task<List<BotConfig>> GetAllAsync() =>
            await _botConfigCollection.Find(_ => true).ToListAsync();

        public async Task<BotConfig> GetByIdAsync(string id) =>
            await _botConfigCollection.Find(botConfig => botConfig.Id == id).FirstOrDefaultAsync();

        public async Task CreateAsync(BotConfig botConfig) =>
            await _botConfigCollection.InsertOneAsync(botConfig);

        public async Task UpdateAsync(string id, BotConfig botConfig) =>
            await _botConfigCollection.ReplaceOneAsync(botConfig => botConfig.Id == id, botConfig);

        public async Task DeleteAsync(string id) =>
            await _botConfigCollection.DeleteOneAsync(botConfig => botConfig.Id == id);
    }

}
