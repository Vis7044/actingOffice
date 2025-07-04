using backend.Data;
using backend.Dtos.ClientDto;
using backend.Models;
using MongoDB.Bson;
using System.Security.Cryptography.X509Certificates;

namespace backend.services
{
    public class ClientHistoryService
    {
        private readonly MongoDbContext _context;   

        public ClientHistoryService(MongoDbContext context)
        {
            _context = context;
        }   

        public async Task<string> CreateClientHistoryAsync(ClientHistoryDto dto)
        {
            var clientHistory = new ClientHistory
            {
                ClientId = dto.ClientId,
                Type = dto.Type,    

            };
            await _context.ClientHistory.InsertOneAsync(clientHistory);
            return clientHistory.Id;
        }
    }
}
