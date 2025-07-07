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
            if (dto.Services == null || !dto.Services.Any())
            {
                throw new ArgumentException("At least one service must be provided.");
            }

            int sequence = await _counter.GetNextSequenceAsync("quote");
            string quoteNumber = $"QT-{sequence:D6}";

            // Validate the business ID
            var businessId = await _context.Clients.Find(c => c.BusinessName == dto.BusinessName).Project(c => c.Id).FirstOrDefaultAsync();

            // Server-side calculations
            var amountBeforeVat = dto.Services.Sum(s => s.Amount);
            var vatRate = dto.VatRate; // 0 or 20 (from dropdown)
            var vatAmount = Math.Round(amountBeforeVat * (vatRate / 100m), 2);
            var totalAmount = amountBeforeVat + vatAmount;



            var quote = new QuoteModel
            {
                BusinessId = businessId,
                BusinessName = dto.BusinessName,
                FristResponse = dto.FristResponse,
                QuoteNumber = quoteNumber,
                Date = dto.Date,
                AmountBeforeVat = amountBeforeVat,
                VatRate = vatRate,
                VatAmount = vatAmount,
                TotalAmount = totalAmount,
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

        public async Task<List<QuoteModel>> GetQouteAsync()
        {
            return await _quote.Find(_ => true).ToListAsync();
        } 
    }
}
