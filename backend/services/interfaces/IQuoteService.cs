using backend.Dtos.QuoteDto;
using backend.helper;
using backend.Models;
using static backend.services.QuoteService;

namespace backend.services.interfaces
{
    public interface IQuoteService
    {
        Task<string> CreateQuoteAsync(CreateQuoteDto dto, string userId);
        Task<PageResult<QuoteModel>> GetQouteAsync(string role, string userId, int page, int pageSize, string searchTerm, string criteria, string value,string IsDeleted);
        Task<GetQuote> GetQuoteById(string id);
        Task<string> DeleteClientAsync(string quoteId, string userId, string role);
        Task<string> UpdateQuoteAsync(QuoteModel quote, string userId, string role, string quoteId);
        Task<QuoteStats?> GetQuoteStats(string role, string userId);
        Task<PageResult<QuoteSummaryDto>> GetUsersQuoteStatus(int page, int pageSize);
        Task<List<DailyQuoteSummary>> GetDailyQuoteDetails(int offset);
        Task<List<DailyQouteAmountStats>> GetUsersQuoteAmountStatus(int offset);
    }
}
