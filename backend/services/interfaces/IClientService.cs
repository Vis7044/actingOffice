using backend.Dtos.ClientDto;
using backend.Models;

namespace backend.services.interfaces
{
    public interface IClientService
    {
        Task<string> CreateClientAsync(CreateClient clientDto);
        //Task<ClientModel> GetClientByIdAsync(string clientId);
        //Task<List<ClientModel>> GetAllClientsAsync();
        //Task<string> UpdateClientAsync(string clientId, UpdateClient clientDto);
        //Task<string> DeleteClientAsync(string clientId);
    }
}
