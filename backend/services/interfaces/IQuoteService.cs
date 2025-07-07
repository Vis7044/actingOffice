using backend.Dtos.QuoteDto;
using backend.Models;

namespace backend.services.interfaces
{
    public interface IQuoteService
    {
        Task<string> CreateQuoteAsync(CreateQuoteDto dto);
        Task<List<QuoteModel>> GetQouteAsync();
    }
}
