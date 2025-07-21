using backend.Data;
using backend.Dtos.QuoteDto;
using backend.Enums;
using backend.helper;
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

        /// <summary>
        /// create a new service
        /// </summary>
        /// <param name="service"></param>
        /// <returns></returns>
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
        /// <summary>
        /// get all services
        /// </summary>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <param name="searchTerm"></param>
        /// <returns></returns>
        [HttpGet("get")]
        public async Task<IActionResult> GetServices([FromQuery] int page = 1, [FromQuery] int pageSize = 15, [FromQuery] string searchTerm = "", [FromQuery] string IsDeleted="")
        {
            try
            {

                var filter = new BsonDocument();
                if (GetRole() != UserRole.Admin.ToString())
                {
                    filter.Add("CreatedBy.UserId",new ObjectId(GetUserId()));
                }
                if(!string.IsNullOrEmpty(searchTerm))
                {
                    filter.Add("$or", new BsonArray
                    {
                        new BsonDocument("Name", new BsonDocument { { "$regex", searchTerm }, { "$options", "i" } }),
                        new BsonDocument("Description", new BsonDocument { { "$regex", searchTerm }, { "$options", "i" } })
                    });
                }
                if (!string.Equals(IsDeleted, "All", StringComparison.OrdinalIgnoreCase))
                {
                    if (Enum.TryParse<IsDeleted>(IsDeleted, out var deleted))
                    {
                        filter.Add("IsDeleted", (int)deleted);
                    }
                    
                }

                var result = await _serviceCollection.Find(filter).Skip((page-1)*pageSize).Limit(pageSize).ToListAsync();
                var countFilter = new BsonDocument(filter);
                var totalCount = await _serviceCollection.CountDocumentsAsync(countFilter);
                return Ok(new PageResult<Service>
                {
                    TotalCount = totalCount,
                    Page = page,
                    PageSize = pageSize,
                    Data = result
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving services: {ex.Message}");
            }
        }
        /// <summary>
        /// return service by id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("get/{id}")]
        public async Task<IActionResult> GetServiceById(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest("Service ID is required.");
            }
            var service = await _serviceCollection.Find(s => s.Id == id).FirstOrDefaultAsync();
            if (service == null)
            {
                return NotFound("Service not found.");
            }
            return Ok(service);
        }
        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateServiceAsync(string id, [FromBody] Service service)
        {
            if (string.IsNullOrEmpty(id) || service == null)
            {
                return BadRequest("Invalid service data.");
            }
            if (GetRole() != UserRole.Admin.ToString())
            {
                var existingService = await _serviceCollection.Find(s => s.Id == id && s.CreatedBy.UserId == GetUserId()).FirstOrDefaultAsync();
                if (existingService == null)
                {
                    return NotFound("Service not found or you do not have permission to update this service.");
                }
            }
            try
            {
                var filter = Builders<Service>.Filter.Eq(c => c.Id, id);
                var update = Builders<Service>.Update
                    .Set(s => s.Name, service.Name)
                    .Set(s => s.Description, service.Description)
                    .Set(s => s.Amount, service.Amount)
                    .Set(s => s.IsDeleted, service.IsDeleted);
                var result = await _serviceCollection.UpdateOneAsync(filter, update);
                if (result.ModifiedCount == 0)
                {
                    return NotFound("No service found to update.");
                }
                return Ok("Service updated successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error updating service: {ex.Message}");
            }
        }
        /// <summary>
        /// soft delete service by id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPost("delete/{id}")]
        public async Task<IActionResult> DeleteServiceAsycn(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest("Service ID is required.");
            }
            if (GetRole() != UserRole.Admin.ToString())
            {
                var service = await _serviceCollection.Find(s => s.Id == id && s.CreatedBy.UserId == GetUserId()).FirstOrDefaultAsync();
                if (service == null)
                {
                    return NotFound("Service not found or you do not have permission to delete this service.");
                }
            }  
            try
            {
                var filter = Builders<Service>.Filter.Eq(c => c.Id, id);
                var result = await _serviceCollection.UpdateOneAsync(filter, Builders<Service>.Update.Set(x => x.IsDeleted, IsDeleted.Inactive));
                if (result.ModifiedCount == 0)
                {
                    throw new Exception("No client found to delete.");
                }
                return Ok("Service deleted successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error deleting service: {ex.Message}");
            }
        }
    }
}
