using backend.Dtos.QuoteDto;
using backend.helper;
using backend.Models;

namespace backend.services.interfaces
{
    public interface IQuoteService
    {
        Task<string> CreateQuoteAsync(CreateQuoteDto dto);
        Task<PageResult<QuoteModel>> GetQouteAsync(string role, string userId, int page, int pageSize, string searchTerm);
        Task<QuoteModel> GetQuoteById(string id);
    }
}
