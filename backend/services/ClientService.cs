using backend.Data;
using backend.Dtos.ClientDto;
using backend.Models;
using backend.services.interfaces;
using MongoDB.Driver;

namespace backend.services
{
    public class ClientService: IClientService
    {
        private readonly MongoDbContext _context;
        private readonly IMongoCollection<ClientModel> _client;
        private readonly CounterService _sequenceService;
        public ClientService(MongoDbContext context, CounterService sequenceService)
        {
            _client = context.Clients;
            _sequenceService = sequenceService;
        }


        public async Task<string> CreateClientAsync(CreateClient client)
        {
            int sequence = await _sequenceService.GetNextSequenceAsync("client");

            // Create a new client model from the DTO
            var clientData = new ClientModel
            {
                ClientId = $"CL-{sequence:D6}",
                BusinessName = client.BusinessName,
                Type = client.Type,
                Address = client.Address
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
    }
}
