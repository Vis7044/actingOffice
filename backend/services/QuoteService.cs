using backend.Data;
using backend.Dtos.ClientDto;
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

        public async Task<string> CreateQuoteAsync(CreateQuoteDto dto, string userId)
        {
            if (dto.Services == null || !dto.Services.Any())
            {
                throw new ArgumentException("At least one service must be provided.");
            }

            int sequence = await _counter.GetNextSequenceAsync("quote");
            string quoteNumber = $"QT-{sequence:D6}";

            // Validate the business ID
            var businessId = await _context.Clients.Find(c => c.BusinessName == dto.BusinessName).Project(c => c.Id).FirstOrDefaultAsync();

            if( businessId == null)
            {
                throw new ArgumentException("Business not found.");
            }

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
                UserId = userId,
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

        public async Task<PageResult<QuoteModel>> GetQouteAsync(string role, string userId, int page, int pageSize, string searchTerm, string criteria, string value)
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
                filters.Add("userId", new ObjectId(userId));
            }
            if (!string.IsNullOrEmpty(criteria) && !string.IsNullOrEmpty(value))
            {

                filters.Add(criteria, new BsonDocument { { "$regex", value }, { "$options", "i" } });

            }

            if (!string.IsNullOrEmpty(search))
            {
                filters.Add("$or", new BsonArray
                {
                    new BsonDocument("BusinessName", new BsonDocument { { "$regex", search }, { "$options", "i" } }),
                    new BsonDocument("FirstResponse", new BsonDocument { { "$regex", search }, { "$options", "i" } })
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

        public async Task<string> UpdateQuoteAsync(CreateQuoteDto quote, string userId, string role, string quoteId)
        {
            try
            {
                if (role != "Admin")
                {
                    var existingClient = await _client.Find(c => c.Id == quoteId && c.UserId == userId).FirstOrDefaultAsync();
                    if (existingClient == null)
                    {
                        return "You do not have permission to update this client.";
                    }
                }

                var filter = Builders<QuoteModel>.Filter.Eq(
                  c => c.Id, quoteId
                );

  

                var update = Builders<QuoteModel>.Update
                    .Set(c => c.BusinessName, quote.BusinessName)
                    .Set(c => c.FirstResponse, quote.FirstResponse)
                    .Set(c => c.Date, quote.Date)
                    .Set(c => c.AmountBeforeVat, quote.AmountBeforeVat)
                    .Set(c => c.VatRate, quote.VatRate)
                    .Set(c => c.VatAmount, quote.VatAmount)
                    .Set(c => c.TotalAmount, quote.TotalAmount)
                    .Set(c => c.Services, quote.Services.Select(s => new QuoteServiceItem
                    {
                        ServiceName = s.ServiceName,
                        Description = s.Description,
                        Amount = s.Amount
                    }).ToList());

                var result = await _quote.UpdateOneAsync(filter, update);

                if (result.MatchedCount == 0)
                {
                    return "No client found to update.";
                }

                return "Client updated successfully";
            }
            catch (Exception ex)
            {
                throw new Exception($"Error updating client: {ex.Message}");
            }
        }

        public async Task<string> DeleteClientAsync(string quoteId, string userId, string role)
        {
            try
            {
                if (role != "Admin")
                {
                    var existingClient = await _quote.Find(c => c.Id == quoteId && c.UserId == userId).FirstOrDefaultAsync();
                    if (existingClient == null)
                    {
                        return "You do not have permission to update this client.";
                    }
                }
                var filter = Builders<QuoteModel>.Filter.Eq(c => c.Id, quoteId);
                var result = await _quote.DeleteOneAsync(filter);
                if (result.DeletedCount == 0)
                {
                    throw new Exception("No client found to delete.");
                }
                return "deleted Successfully";
            }
            catch (Exception ex)
            {
                throw new Exception($"Error deleting client: {ex.Message}");
            }
        }
    }
}
