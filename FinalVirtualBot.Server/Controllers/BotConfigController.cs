
using Microsoft.AspNetCore.Mvc;
using UserAuthentication.Models;
using UserAuthentication.Repository;
using System.Collections.Generic;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class BotConfigController : ControllerBase
{
    private readonly IBotConfigRepository _botConfigRepository;

    public BotConfigController(IBotConfigRepository botConfigRepository)
    {
        _botConfigRepository = botConfigRepository;
    }

    [HttpGet]

    public async Task<ActionResult<List<BotConfigDTO>>> GetAll()
    {
        var botConfigs = await _botConfigRepository.GetAllAsync();
        return Ok(botConfigs);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<BotConfigDTO>> GetById(string id)
    {
        var botConfig = await _botConfigRepository.GetByIdAsync(id);
        if (botConfig == null)
            return NotFound();
        return Ok(botConfig);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] BotConfigDTO botConfigDto)
    {
       
        var botConfig = new BotConfig
        { //configuration of bot through botDtos
            BotName = botConfigDto.BotName,
            Provider = botConfigDto.Provider,
            ConfigVersion = botConfigDto.ConfigVersion,
            JsonServiceAccount = botConfigDto.JsonServiceAccount,
            Region = botConfigDto.Region,
            Language = botConfigDto.Language
        };
        //saving to database
        await _botConfigRepository.CreateAsync(botConfig);

        //response object jab bot configure hojyega
        var response = new
        {
            Message = "Bot configuration created successfully.",
            BotConfig = botConfig
        };

        // Return the response
        return CreatedAtAction(
            nameof(GetById),
            new { id = botConfig.Id },
            response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] BotConfigDTO botConfigDto)
    {
        var existingBotConfig = await _botConfigRepository.GetByIdAsync(id);
        if (existingBotConfig == null)
            return NotFound();

        var updatedBotConfig = new BotConfig
        {
            Id = id,
            BotName = botConfigDto.BotName,
            Provider = botConfigDto.Provider,
            ConfigVersion = botConfigDto.ConfigVersion,
            JsonServiceAccount = botConfigDto.JsonServiceAccount,
            Region = botConfigDto.Region,
            Language = botConfigDto.Language
        };

        await _botConfigRepository.UpdateAsync(id, updatedBotConfig);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var botConfig = await _botConfigRepository.GetByIdAsync(id);
        if (botConfig == null)
            return NotFound();

        await _botConfigRepository.DeleteAsync(id);
        return NoContent();
    }
}
