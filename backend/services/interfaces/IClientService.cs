using backend.Dtos.ClientDto;
using backend.helper;
using backend.Models;
using Microsoft.AspNetCore.Mvc.RazorPages;
using MongoDB.Bson;

namespace backend.services.interfaces
{
    public interface IClientService
    {
        Task<string> CreateClientAsync(CreateClient clientDto, string userId);
        Task<PageResult<ClientModel>> GetClientsAsync(string role, string userId,int page, int pageSize, string searchTerm);
        Task<ClientModelWithHistory> GetClientByIdAsync(string clientId);
        Task<List<ClientModel>> SearchByBusinessNameAsync(string query);
        //Task<ClientModel> GetClientByIdAsync(string clientId);
        //Task<List<ClientModel>> GetAllClientsAsync();
        //Task<string> UpdateClientAsync(string clientId, UpdateClient clientDto);
        //Task<string> DeleteClientAsync(string clientId);
    }
}
