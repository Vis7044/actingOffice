using backend.Data;
using backend.Dtos.ClientDto;
using backend.Enums;
using backend.helper;
using backend.Models;
using backend.services.interfaces;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using System.Data;
using System.Linq;
using System.Text.RegularExpressions;

namespace backend.services
{

    public class ClientService : IClientService
    {
        private readonly MongoDbContext _context;
        private readonly IMongoCollection<ClientModel> _client;
        private readonly IMongoCollection<UserModel> _users;
        private readonly CounterService _sequenceService;
        private readonly HistoryService _history;
        private readonly IMongoCollection<History> _historyDb;

        public ClientService(MongoDbContext context, CounterService sequenceService, HistoryService history)
        {
            _context = context;
            _client = context.Clients;
            _users = context.Users;                   
            _sequenceService = sequenceService;
            _history = history;
            _historyDb = context.History;
        }


        /// <summary>
        /// 
        /// </summary>
        /// <param name="client"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        public async Task<string> CreateClientAsync(CreateClient client, string userId)
        {
            var existingClient = await _client.Find(c => c.BusinessName == client.BusinessName).FirstOrDefaultAsync();
            if (existingClient != null)
            {
                throw new Exception("Client with this business name "+client.BusinessName+" already exists ");
            }
            int sequence = await _sequenceService.GetNextSequenceAsync("client");
            var user = await _users.Find(u => u.Id == userId).FirstOrDefaultAsync();    

            // Create a new client model from the DTO
            var clientData = new ClientModel
            {
                ClientId = $"CL-{sequence:D6}",
                BusinessName = client.BusinessName,
                Type = client.Type,
                Address = client.Address,
                CreatedBy = new CreatedBy
                {
                    UserId = userId,
                    FirstName = user?.FirstName ?? "Unknown",
                    LastName = user?.LastName ?? "Unknown",
                },
            };
            
            try
            {
                await _client.InsertOneAsync(clientData);
                var history = new History
                {
                    Action = HistoryAction.Created,
                    CreatedBy = new CreatedBy
                    {
                        UserId = userId,
                        FirstName = user?.FirstName ?? "Unknown",
                        LastName = user?.LastName ?? "Unknown",
                        DateTime = DateTime.UtcNow
                    },
                    Description = $"Client {client.BusinessName} created",
                    Target = new Target
                    {
                        Id = clientData.Id,
                        Name = clientData.BusinessName,
                    }

                };
                var historyId = await _history.CreateClientHistoryAsync(history);
                return "Client created successfully";
            }
            catch (Exception ex)
            {
                throw new Exception($"Error creating client: {ex.Message}");
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="role"></param>
        /// <param name="userId"></param>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <param name="searchTerm"></param>
        /// <returns></returns>
        /// <exception cref="ArgumentException"></exception>
        /// <exception cref="Exception"></exception>
        public async Task<PageResult<ClientModel>> GetClientsAsync(
            string role,
            string userId,
            int page,
            int pageSize,
            string searchTerm,
            string criteria,
            string value,
            string IsDeleted)
        {
            if (page < 1 || pageSize < 1)
                throw new ArgumentException("Page and pageSize must be greater than 0.");

            int skip = (page - 1) * pageSize;
            string search = searchTerm?.Trim() ?? string.Empty;

            var builder = Builders<ClientModel>.Filter;
            var filter = builder.Empty;

            // Role filter
            if (role != UserRole.Admin.ToString())
                filter &= builder.Eq(c => c.CreatedBy.UserId, userId);

            // Business Type filter
            if (!string.IsNullOrEmpty(value) && criteria == "Type")
            {
                if (Enum.TryParse<BusinessType>(value, out var businessType))
                    filter &= builder.Eq(c => c.Type, businessType);
                else
                    throw new ArgumentException("Invalid business type value.");
            }

            // IsDeleted filter
            if (!string.Equals(IsDeleted, "All", StringComparison.OrdinalIgnoreCase))
            {
                if (Enum.TryParse<IsDeleted>(IsDeleted, out var deleted))
                    filter &= builder.Eq(c => c.IsDeleted, deleted);
                else
                    throw new ArgumentException("Invalid delete type value.");
            }

            // Search filter
            if (!string.IsNullOrWhiteSpace(search))
            {
                var searchFilters = new List<FilterDefinition<ClientModel>>
                {
                    builder.Regex(c => c.BusinessName, new BsonRegularExpression(search, "i"))
                };

                if (Enum.TryParse<BusinessType>(search, out var parsedSearchType))
                    searchFilters.Add(builder.Eq(c => c.Type, parsedSearchType));

                filter &= builder.Or(searchFilters);
            }

            // Projection
            var projection = Builders<ClientModel>.Projection
                .Include(c => c.ClientId)
                .Include(c => c.BusinessName)
                .Include(c => c.Type)
                .Include(c => c.CreatedBy)
                .Include(c => c.IsDeleted);

            // Fetch data
            try
            {
                var result = await _client.Find(filter)
                    .Project<ClientModel>(projection)
                    .SortByDescending(c => c.CreatedBy.DateTime)
                    .Skip(skip)
                    .Limit(pageSize)
                    .ToListAsync();

                var totalCount = await _client.CountDocumentsAsync(filter);

                return new PageResult<ClientModel>
                {
                    TotalCount = totalCount,
                    Page = page,
                    PageSize = pageSize,
                    Data = result
                };
            }
            catch (Exception ex)
            {
                throw new Exception($"Error fetching clients: {ex.Message}");
            }
        }


        /// <summary>
        /// get client by id
        /// </summary>
        /// <param name="clientId"></param>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        public async Task<ClientModelWithHistory> GetClientByIdAsync(string clientId)
        {
            var client = await _client.Find(c => c.Id == clientId).FirstOrDefaultAsync();

            if (client == null)
                throw new Exception("Client not found");

            // Get history records
            var history = await _historyDb
                .Find(h => h.Target.Id == clientId)
                .SortByDescending(h=>h.CreatedBy.DateTime)
                .ToListAsync();


            var historyWithUsers = history.Select(h =>
            {
                var user = _users.Find(u => u.Id == h.CreatedBy.UserId).FirstOrDefault();
                return new HistoryWithUser
                {
                    History = h,
                    User = user
                };
            }).ToList();

            return new ClientModelWithHistory
            {
                Client = client,
                HistoryWithUsers = historyWithUsers
            };
        }

        public async Task<List<ClientModel>> SearchByBusinessNameAsync(string query)
        {
            var filter = Builders<ClientModel>.Filter.Regex("BusinessName", new BsonRegularExpression(query, "i"));
            var projection = Builders<ClientModel>.Projection.Include(x => x.BusinessName);
            var result = await _client
                .Find(filter)
                .Project<ClientModel>(projection)
                .Limit(10)
                .ToListAsync();

            return result;
        }

        /// <summary>
        /// update client
        /// </summary>
        /// <param name="client"></param>
        /// <param name="userId"></param>
        /// <param name="role"></param>
        /// <param name="businessId"></param>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        public async Task<string> UpdateClientAsync(CreateClient client, string userId,string role, string businessId)
        {
            try
            {
                if(role != "Admin" )
                {
                    var existingClient = await _client.Find(c => c.Id == businessId && c.CreatedBy.UserId == userId).FirstOrDefaultAsync();
                    if (existingClient == null)
                    {
                        return "You do not have permission to update this client.";
                    }
                }

                var filter = Builders<ClientModel>.Filter.Eq(
                  c => c.Id, businessId
                );


                var clientBeforeUpdate = await _client.Find(c => c.Id == businessId).FirstOrDefaultAsync();
                if (clientBeforeUpdate == null)
                {
                    return "No client found to update.";
                }
                if(client.Address == null)
                {
                    client.Address = clientBeforeUpdate.Address;
                }
                

                var update = Builders<ClientModel>.Update
                    .Set(c => c.BusinessName, client.BusinessName)
                    .Set(c => c.Type, client.Type)
                    .Set(c => c.IsDeleted, client.IsDeleted)
                    .Set(c => c.Address, client.Address);

                var result = await _client.UpdateOneAsync(filter, update);

                var chengedClient = await _client.Find(c => c.Id == businessId).FirstOrDefaultAsync();


                var changes = new Dictionary<string, string>();
                // Compare fields and add to changes dictionary
                if (clientBeforeUpdate.BusinessName != chengedClient.BusinessName)
                {
                    changes["BusinessName"] = $"'{clientBeforeUpdate.BusinessName}' → '{chengedClient.BusinessName}'";
                }

                if (clientBeforeUpdate.Type != chengedClient.Type)
                {
                    changes["Type"] = $"'{clientBeforeUpdate.Type}' → '{chengedClient.Type}'";
                }

                // Compare address sub-fields
                if (clientBeforeUpdate.Address.Street != chengedClient.Address.Street)
                {
                    changes[".Street"] = $"'{clientBeforeUpdate.Address.Street}' → '{chengedClient.Address.Street}'";
                }

                if (clientBeforeUpdate.Address.City != chengedClient.Address.City)
                {
                    changes["City"] = $"'{clientBeforeUpdate.Address.City}' → '{chengedClient.Address.City}'";
                }
                if (clientBeforeUpdate.Address.Country != chengedClient.Address.Country)
                {
                    changes["Country"] = $"'{clientBeforeUpdate.Address.Country}' → '{chengedClient.Address.Country}'";
                }
                if (clientBeforeUpdate.Address.Building != chengedClient.Address.Building)
                {
                    changes["Building"] = $"'{clientBeforeUpdate.Address.Building}' → '{chengedClient.Address.Building}'";
                }
                if (clientBeforeUpdate.Address.PinCode != chengedClient.Address.PinCode)
                {
                    changes["Building"] = $"'{clientBeforeUpdate.Address.PinCode}' → '{chengedClient.Address.PinCode}'";
                }
                if (clientBeforeUpdate.IsDeleted != chengedClient.IsDeleted)
                {
                    changes["IsDeleted"] = $"'{clientBeforeUpdate.IsDeleted}' → '{chengedClient.IsDeleted}'";
                }
                var changesSummary = changes.Count > 0
                    ? string.Join("; ", changes.Select(c => $"{c.Key}: {c.Value}"))
                    : "No significant changes detected";

                var user = await _users.Find(u => u.Id == userId).FirstOrDefaultAsync();

                if (result.MatchedCount == 0)
                {
                    return "No client found to update.";
                }
                // if matched count is not 0 then create history
                var history = new History
                {
                    Action = HistoryAction.Updated,
                    CreatedBy = new CreatedBy
                    {
                        UserId = userId,
                        FirstName =user.FirstName  ?? "Unknown",
                        LastName = user.LastName ?? "Unknown",
                        DateTime = DateTime.UtcNow
                    },
                    Description = $"Client updated: {changesSummary}",
                    Target = new Target
                    {
                        Id = clientBeforeUpdate.Id,
                        Name = clientBeforeUpdate.BusinessName
                    }
                };

                var historyId = await _history.CreateClientHistoryAsync(history);

                return "Client updated successfully";
            }
            catch (Exception ex)
            {
                throw new Exception($"Error updating client: {ex.Message}");
            }
        }
        /// <summary>
        /// soft delete client
        /// </summary>
        /// <param name="businessId"></param>
        /// <param name="userId"></param>
        /// <param name="role"></param>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        public async Task<string> DeleteClientAsync(string businessId, string userId, string role)
        {
            try
            {
                // Check if the user has permission to delete the client
                if (role != UserRole.Admin.ToString())
                {
                    var existingClient = await _client.Find(c => c.Id == businessId && c.CreatedBy.UserId == userId).FirstOrDefaultAsync();
                    if (existingClient == null)
                    {
                        return "You do not have permission to update this client.";
                    }
                }
                // Find the client by ID
                var filter = Builders<ClientModel>.Filter.Eq(c => c.Id, businessId);
                var client = await _client.Find(filter).FirstOrDefaultAsync();

                if (client == null)
                {
                    return "Client not found.";
                }
                var result = await _client.UpdateOneAsync(
                    filter,
                    Builders<ClientModel>.Update.Set(c => c.IsDeleted, IsDeleted.Inactive)
                );  
                if (result.ModifiedCount == 0)
                {
                    throw new Exception("No client found to delete.");
                }
                // if modified count is not 0 then create history
                var user = await _users.Find(u => u.Id == userId).FirstOrDefaultAsync();
                var history = new History
                {
                    Action = HistoryAction.Deleted,
                    CreatedBy = new CreatedBy
                    {
                        UserId = userId,
                        FirstName = user?.FirstName ?? "Unknown",
                        LastName = user?.LastName ?? "Unknown", 
                        DateTime = DateTime.UtcNow
                    },
                    Description = $"Client Marked InActive",
                    Target = new Target
                    {
                        Id = client.Id,
                        Name = client.BusinessName
                    }
                };

                var historyId = await _history.CreateClientHistoryAsync(history);
                return "deleted Successfully";
            }
            catch (Exception ex)
            {
                throw new Exception($"Error deleting client: {ex.Message}");
            }
        }

    }
}
