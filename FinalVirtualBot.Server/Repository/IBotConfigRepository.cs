using FinalVirtualBot.Server.Models;

namespace FinalVirtualBot.Server.Repository
{
    public interface IBotConfigRepository
    {
        Task<List<BotConfig>> GetAllAsync();
        Task<BotConfig> GetByIdAsync(string id);
        Task CreateAsync(BotConfig botConfig);
        Task UpdateAsync(string id, BotConfig botConfig);
        Task DeleteAsync(string id);
       
    }
}
