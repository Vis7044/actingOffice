using backend.Data;
using backend.Dtos.ClientDto;
using backend.helper;
using backend.Models;
using backend.services.interfaces;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using System.Linq;
using System.Text.RegularExpressions;

namespace backend.services
{

    public class ClientService : IClientService
    {
        private readonly MongoDbContext _context;
        private readonly IMongoCollection<ClientModel> _client;
        private readonly IMongoCollection<ClientHistory> _clientHistory;
        private readonly IMongoCollection<UserModel> _users;
        private readonly CounterService _sequenceService;
        private readonly ClientHistoryService _history;

        public ClientService(MongoDbContext context, CounterService sequenceService, ClientHistoryService history)
        {
            _context = context;
            _client = context.Clients;
            _clientHistory = context.ClientHistory; // ✅ Add this
            _users = context.Users;                   // ✅ And this
            _sequenceService = sequenceService;
            _history = history;
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
            int sequence = await _sequenceService.GetNextSequenceAsync("client");
            var history = new ClientHistoryDto
            {
                Type = "created",
                ClientId = userId

            };
            var historyId = await _history.CreateClientHistoryAsync(history);

            // Create a new client model from the DTO
            var clientData = new ClientModel
            {
                ClientId = $"CL-{sequence:D6}",
                BusinessName = client.BusinessName,
                Type = client.Type,
                Address = client.Address,
                UserId = userId,
                History = new List<string> { historyId }
            };
            try
            {
                await _client.InsertOneAsync(clientData);
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
        public async Task<PageResult<ClientModel>> GetClientsAsync(string role, string userId, int page, int pageSize, string searchTerm)
        {
            if (page < 1 || pageSize < 1)
            {
                throw new ArgumentException("Page and pageSize must be greater than 0.");
            }

            var skip = (page - 1) * pageSize;
            var search = searchTerm?.Trim() ?? string.Empty;

            // Create match filter
            var filters = new BsonDocument();

            if (role != "Admin")
            {
                filters.Add("userId", userId);
            }

            if (!string.IsNullOrEmpty(search))
            {
                filters.Add("$or", new BsonArray
                {
                    new BsonDocument("businessName", new BsonDocument { { "$regex", search }, { "$options", "i" } }),
                    new BsonDocument("type", new BsonDocument { { "$regex", search }, { "$options", "i" } })
                });
            }

            // MongoDB aggregation pipeline
            var pipeline = new BsonDocument[]
            {
                new BsonDocument("$match", filters),
                new BsonDocument("$sort", new BsonDocument("createdOn", -1)),
                new BsonDocument("$skip", skip),
                new BsonDocument("$limit", pageSize)
            };

            try
            {
                var result = await _client.Aggregate<ClientModel>(pipeline).ToListAsync();

                // Get total count with same match condition
                var countFilter = new BsonDocument(filters);
                var totalCount = await _client.CountDocumentsAsync(countFilter);

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


        public async Task<ClientModelWithHistory> GetClientByIdAsync(string clientId)
        {
            var client = await _client.Find(c => c.Id == clientId).FirstOrDefaultAsync();

            if (client == null)
                throw new Exception("Client not found");

            // Get history records
            var history = await _clientHistory
                .Find(h => client.History.Contains(h.Id))
                .ToListAsync();

            // Get unique userIds from history
            var userIds = history
                .Select(h => h.ClientId)
                .Where(id => !string.IsNullOrEmpty(id))
                .Distinct()
                .ToList();

            var users = await _users
                .Find(u => userIds.Contains(u.Id))
                .ToListAsync();

            // Join history + user
            var historyWithUsers = history.Select(h =>
            {
                var user = users.FirstOrDefault(u => u.Id == h.ClientId);
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




    }
}
