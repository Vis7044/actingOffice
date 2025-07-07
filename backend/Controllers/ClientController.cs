using backend.Dtos.ClientDto;
using backend.helper;
using backend.services.interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;


namespace backend.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ClientController : ControllerBase
    {
        private readonly IClientService _clientService;

        public ClientController(IClientService clientService)
        {
            _clientService = clientService;
        }

        private string GetUserId() =>
            User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;

        private string? GetRole() =>
            User?.FindFirstValue(ClaimTypes.Role) ?? string.Empty;

      
        [HttpPost("create")]
        public async Task<IActionResult> CreateClientAsync([FromBody] CreateClient client)
        {
            try
            {
                var result = await _clientService.CreateClientAsync(client, GetUserId());
                return Ok(User.GetUserId());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("getClient")]
        public async Task<IActionResult> GetClientAsync([FromQuery] int page=1, [FromQuery] int pageSize = 15, [FromQuery] string searchTerm="")
        {
            try
            {
                var result = await _clientService.GetClientsAsync(GetRole(),GetUserId(), page, pageSize, searchTerm);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("getClient/{clientId:length(24)}")]
        public async Task<IActionResult> GetClientByIdAsync([FromRoute] string clientId)
        {
            try
            {
                var result = await _clientService.GetClientByIdAsync(clientId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return BadRequest("Query string cannot be empty.");

            var results = await _clientService.SearchByBusinessNameAsync(query);
            return Ok(results.Select(c => new {
                id = c.Id,
                name = c.BusinessName
            }));
        }

    }
}
