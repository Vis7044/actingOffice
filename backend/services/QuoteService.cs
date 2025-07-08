using backend.Data;
using backend.Dtos.QuoteDto;
using backend.helper;
using backend.Models;
using backend.services.interfaces;
using MongoDB.Bson;
using MongoDB.Driver;
using System.Diagnostics.Metrics;

namespace backend.services
{
    public class QuoteService : IQuoteService
    {
        private readonly MongoDbContext _context;
        private readonly IMongoCollection<QuoteModel> _quote;
        private readonly IMongoCollection<ClientModel> _client;
        public readonly CounterService _counter;
        public QuoteService(MongoDbContext context, CounterService counter)
        {
            _context = context;
            _quote = context.Quote; // Initialize the quotes collection
            _counter = counter; // Initialize the counters collection
            _client = context.Clients;
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
                FirstResponse = dto.FirstResponse,
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

        public async Task<PageResult<QuoteModel>> GetQouteAsync(string role, string userId, int page, int pageSize, string searchTerm)
        {
            if (page < 1 || pageSize < 1)
            {
                throw new ArgumentException("Page and page size must be greater than 0.");
            }
            var skip = (page - 1) * pageSize;
            var search = searchTerm?.Trim() ?? string.Empty;

            // Create match filter
            var filters = new BsonDocument();

            if (role != "Admin")
            {
                filters.Add("userId", userId);
            }

            if (!string.IsNullOrEmpty(search))
            {
                filters.Add("$or", new BsonArray
                {
                    new BsonDocument("businessName", new BsonDocument { { "$regex", search }, { "$options", "i" } }),
                    new BsonDocument("firstResponse", new BsonDocument { { "$regex", search }, { "$options", "i" } })
                });
            }


            var pipeline = new BsonDocument[]
            {
                new BsonDocument("$match", filters),
                new BsonDocument("$sort", new BsonDocument("Date", -1)),
                new BsonDocument("$skip", (page - 1) * pageSize),
                new BsonDocument("$limit", pageSize),
                
            };

            try
            {
                var quotes = await _quote.Aggregate<QuoteModel>(pipeline).ToListAsync();
                var countFilter = new BsonDocument(filters);
                var totalCount = await _quote.CountDocumentsAsync(countFilter);

                return new PageResult<QuoteModel>
                {
                    TotalCount = totalCount,
                    Page = page,
                    PageSize = pageSize,
                    Data = quotes
                };
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving quotes: {ex.Message}");
            }



        }


        public async Task<QuoteModel> GetQuoteById(string quoteId)
        {
            if (string.IsNullOrEmpty(quoteId))
            {
                throw new ArgumentException("Quote ID cannot be null or empty.");
            }

            var result = await _quote.Find(q => q.Id == quoteId).FirstOrDefaultAsync(); 
            if (result == null)
            {
                throw new Exception("Quote not found.");
            }
            var businessId = result.BusinessId;
            if (businessId == null)
            {
                throw new Exception("Business ID not found for the quote.");
            }
            var business = await _client.Find(c => c.Id == businessId).FirstOrDefaultAsync();   

            var quote = new QuoteModel
            {
                Id = result.Id,
                BusinessId = businessId,
                BusinessName = business?.BusinessName ?? "Unknown",
                FirstResponse = result.FirstResponse,
                QuoteNumber = result.QuoteNumber,
                Date = result.Date,
                AmountBeforeVat = result.AmountBeforeVat,
                VatRate = result.VatRate,
                VatAmount = result.VatAmount,
                TotalAmount = result.TotalAmount,
                Services = result.Services.Select(s => new QuoteServiceItem
                {
                    ServiceName = s.ServiceName,
                    Description = s.Description,
                    Amount = s.Amount
                }).ToList(),
                BusinessDetails = business
            };

            return quote;
        }
    }
}
