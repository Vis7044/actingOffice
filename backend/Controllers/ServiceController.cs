using backend.Data;
using backend.Enums;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using System.Security.Claims;

namespace backend.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ServiceController : ControllerBase
    {
        private readonly IMongoCollection<Service> _serviceCollection;
        private readonly MongoDbContext _dbContext;

        public ServiceController(MongoDbContext context)
        {
            _dbContext = context;
            _serviceCollection = _dbContext.Service;
        }

        private string GetUserId() =>
           User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;

        private string? GetRole() =>
            User?.FindFirstValue(ClaimTypes.Role) ?? string.Empty;

        [HttpPost("create")]
        public async Task<IActionResult> CreateService([FromBody] Service service)
        {
            
            if (service == null || string.IsNullOrEmpty(service.Name) || service.Amount <= 0)
            {
                return BadRequest("Invalid service data.");
            }
            var existingService = await _serviceCollection.Find(s => s.Name == service.Name).FirstOrDefaultAsync();
            if (existingService != null)
            {
                return BadRequest("Service with this name already exists.");
            }
            var user = await _dbContext.Users.Find(u => u.Id == GetUserId()).FirstOrDefaultAsync();
            try
            {
                var userId = GetUserId();
                var newSerivce = new Service
                {
                    Name = service.Name,
                    Description = service.Description,
                    Amount = service.Amount,
                    CreatedBy = new CreatedBy
                    {
                        UserId = userId,
                        FirstName = user?.FirstName ?? "Unknown User",
                        LastName = user?.LastName ?? "Unknown User",
                        
                    }
                };
                await _serviceCollection.InsertOneAsync(newSerivce);
                return Ok(new { message = "Service created successfully", serviceId = newSerivce.Id });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error creating service: {ex.Message}");
            }
        }

        [HttpGet("get")]
        public async Task<IActionResult> GetServices([FromQuery] int page = 1, [FromQuery] int pageSize = 15, [FromQuery] string searchTerm = "")
        {
            try
            {

                var filter = new BsonDocument();
                if (GetRole() != UserRole.Admin.ToString())
                {
                    filter.Add("CreatedBy.UserId",new ObjectId(GetUserId()));
                }
                var result = await _serviceCollection.Find(filter).ToListAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving services: {ex.Message}");
            }
        }
    }
}
