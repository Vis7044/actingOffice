using backend.Data;
using backend.Dtos.QuoteDto;
using backend.Models;
using backend.services.interfaces;
using MongoDB.Driver;
using System.Diagnostics.Metrics;

namespace backend.services
{
    public class QuoteService : IQuoteService
    {
        private readonly MongoDbContext _context;
        private readonly IMongoCollection<QuoteModel> _quote;
        public readonly CounterService _counter;
        public QuoteService(MongoDbContext context, CounterService counter)
        {
            _context = context;
            _quote = context.Quote; // Initialize the quotes collection
            _counter = counter; // Initialize the counters collection
        }

        public async Task<string> CreateQuoteAsync(CreateQuoteDto dto)
        {
            int sequence = await _counter.GetNextSequenceAsync("quote");
            string quoteNumber = $"QT-{sequence:D6}";

            var quote = new QuoteModel
            {
                BusinessId = dto.BusinessId,
                BusinessName = dto.BusinessName,
                FristResponse = dto.FirstResponse,
                QuoteNumber = quoteNumber,
                Date = dto.Date,
                Services = dto.Services.Select(s => new QuoteServiceItem
                {
                    ServiceName = s.ServiceName,
                    Description = s.Description,
                    Amount = s.Amount
                }).ToList()
            };

            await _quote.InsertOneAsync(quote);
            return quote.Id;
        }


    }
}
