using backend.Dtos.QuoteDto;
using backend.helper;
using backend.Models;

namespace backend.services.interfaces
{
    public interface IQuoteService
    {
        Task<string> CreateQuoteAsync(CreateQuoteDto dto, string userId);
        Task<PageResult<QuoteModel>> GetQouteAsync(string role, string userId, int page, int pageSize, string searchTerm, string criteria, string value);
        Task<QuoteModel> GetQuoteById(string id);
        Task<string> DeleteClientAsync(string quoteId, string userId, string role);
        Task<string> UpdateQuoteAsync(CreateQuoteDto quote, string userId, string role, string quoteId);
    }
}
