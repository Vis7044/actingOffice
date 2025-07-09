using backend.Dtos.ClientDto;
using backend.helper;
using backend.Models;
using Microsoft.AspNetCore.Identity;
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

        Task<string> UpdateClientAsync(CreateClient client, string userId, string role, string businessId);

        Task<string> DeleteClientAsync(string businessId, string userId,  string role);
        
    }
}
