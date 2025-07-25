﻿using backend.Data;
using backend.Dtos.ClientDto;
using backend.Enums;
using backend.helper;
using backend.Models;
using backend.services.interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using System.Security.Claims;
using System.Text;


namespace backend.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ClientController : ControllerBase
    {
        private readonly IClientService _clientService;
        private readonly MongoDbContext _dbContext;

        public ClientController(IClientService clientService, MongoDbContext dbContext)
        {
            _clientService = clientService;
            _dbContext = dbContext;
        }
        /// <summary>
        /// get the user id from the claims
        /// </summary>
        /// <returns></returns>
        private string GetUserId() =>
            User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;
        /// <summary>
        /// get the role of the user from the claims
        /// </summary>
        /// <returns></returns>
        private string GetRole() =>
            User?.FindFirstValue(ClaimTypes.Role) ?? string.Empty;

        /// <summary>
        /// create a new client
        /// </summary>
        /// <param name="client"></param>
        /// <returns></returns>
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

        /// <summary>
        /// get all clients with pagination and search functionality
        /// </summary>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <param name="searchTerm"></param>
        /// <param name="criteria"></param>
        /// <param name="value"></param>
        /// <param name="IsDeleted"></param>
        /// <returns></returns>
        [HttpGet("getClient")]
        public async Task<IActionResult> GetClientAsync([FromQuery] int page = 1, [FromQuery] int pageSize = 15, [FromQuery] string searchTerm = "", [FromQuery] string criteria = "", [FromQuery] string value = "", [FromQuery] string IsDeleted = "Active")
        {
            try
            {
                var result = await _clientService.GetClientsAsync(GetRole(), GetUserId(), page, pageSize, searchTerm, criteria, value, IsDeleted);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        /// <summary>
        /// get client details by client ID
        /// </summary>
        /// <param name="clientId"></param>
        /// <returns></returns>
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
        /// <summary>
        /// Searches for businesses by their name using the specified query string.
        /// </summary>

        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return BadRequest("Query string cannot be empty.");

            var results = await _clientService.SearchByBusinessNameAsync(query);
            return Ok(results.Select(c => new
            {
                id = c.Id,
                name = c.BusinessName
            }));
        }
        /// <summary>
        /// update an existing client
        /// </summary>
        /// <param name="businessId"></param>
        /// <param name="client"></param>
        /// <returns></returns>
        [HttpPost("update/{businessId}")]
        public async Task<IActionResult> UpdateClientAsync([FromRoute] string businessId, [FromBody] CreateClient client)
        {
            if (string.IsNullOrEmpty(businessId))
            {
                return BadRequest("Client ID cannot be null or empty.");
            }
            try
            {
                var result = await _clientService.UpdateClientAsync(client, GetUserId(), GetRole(), businessId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        /// <summary>
        /// soft delete a client by business ID
        /// </summary>
        /// <param name="businessId"></param>
        /// <returns></returns>
        [HttpPost("delete/{businessId}")]
        public async Task<IActionResult> DeleteClientAsync([FromRoute] string businessId)
        {
            if (string.IsNullOrEmpty(businessId))
            {
                return BadRequest("Client ID cannot be null or empty.");
            }
            try
            {
                var result = await _clientService.DeleteClientAsync(businessId, GetUserId(), GetRole());
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }
        /// <summary>
        /// controller to download all clients as a CSV file
        /// </summary>
        /// <returns></returns>
        [HttpGet("clients/download")]
        public async Task<IActionResult> DownloadClient()
        {
            try
            {
                // Get user details
                var user = await _dbContext.Users.Find(u => u.Id == GetUserId()).FirstOrDefaultAsync();
                if (user == null)
                {
                    return NotFound("User not found.");
                }

                // Build the MongoDB filter
                var builder = Builders<ClientModel>.Filter;
                var filter = builder.Empty;

                if (user.Role != UserRole.Admin)
                {
                    filter = filter & builder.Eq(c => c.CreatedBy!.UserId, GetUserId());
                }

                if (Enum.TryParse<IsDeleted>("Unknown", out var deleted))
                {
                    filter = filter & builder.Ne(c => c.IsDeleted, deleted);
                }

                // Fetch clients from the collection
                var clients = await _dbContext.Clients.Find(filter).ToListAsync();

                if (clients == null || clients.Count == 0)
                {
                    return NotFound("No clients found.");
                }

                // Generate CSV content
                var csvData = new StringBuilder();
                csvData.AppendLine("ClientId,BusinessName,Type,CreatedBy,CreatedDate");

                foreach (var client in clients)
                {
                    var createdBy = $"{client.CreatedBy!.FirstName} {client.CreatedBy.LastName}";
                    var createdDate = client.CreatedBy.DateTime.ToString("yyyy-MM-dd HH:mm:ss");
                    csvData.AppendLine($"{client.ClientId},{client.BusinessName},{client.Type},{createdBy},{createdDate}");
                }

                // Convert CSV to byte array and return as downloadable file
                var csvBytes = Encoding.UTF8.GetBytes(csvData.ToString());
                return File(csvBytes, "text/csv", "Clients.csv");
            }
            catch (Exception ex)
            {
                return BadRequest($"Error downloading clients: {ex.Message}");
            }
        }

    }
}
