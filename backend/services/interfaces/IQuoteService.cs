using backend.Dtos.QuoteDto;

namespace backend.services.interfaces
{
    public interface IQuoteService
    {
        Task<string> CreateQuoteAsync(CreateQuoteDto dto);
    }
}
