using backend.Data;
using backend.Dtos.ClientDto;
using backend.Models;
using MongoDB.Bson;
using System.Security.Cryptography.X509Certificates;

namespace backend.services
{
    public class HistoryService
    {
        private readonly MongoDbContext _context;   

        public HistoryService(MongoDbContext context)
        {
            _context = context;
        }
        /// <summary>
        /// method to create a client history   
        /// </summary>
        /// <param name="dto"></param>
        /// <returns></returns>
        public async Task<string> CreateClientHistoryAsync(History dto)
        {
            
            await _context.History.InsertOneAsync(dto);
            return dto.Id;
        }
    }
}
