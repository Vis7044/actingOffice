using backend.Data;
using backend.Dtos.QuoteDto;
using backend.Enums;
using backend.helper;
using backend.Models;
using backend.services.interfaces;
using MongoDB.Bson;
using MongoDB.Driver;

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
        /// <summary>
        /// Asynchronously creates a quote with the provided details.
        /// </summary>
        /// <param name="dto"></param>
        /// <param name="userId"></param>
        /// <returns>return id of created quote</returns>
        /// <exception cref="ArgumentException"></exception>
        public async Task<string> CreateQuoteAsync(CreateQuoteDto dto, string userId)
        {
            if (dto.Services == null || !dto.Services.Any())
            {
                throw new ArgumentException("At least one service must be provided.");
            }

            int sequence = await _counter.GetNextSequenceAsync("quote");
            string quoteNumber = $"QT-{sequence:D6}";

            // Validate the business ID
            var businessIdName = await _context.Clients.Find(c => c.BusinessName == dto.BusinessName).Project(c => new IdByName
            {
                Id = c.Id,
                Name = c.BusinessName
            }).FirstOrDefaultAsync();

            if ( businessIdName == null)
            {
                throw new ArgumentException("Business not found.");
            }

            // Server-side calculations
            var amountBeforeVat = dto.Services.Sum(s => s.Amount);
            var vatRate = dto.VatRate; // 0 or 20 (from dropdown)
            var vatAmount = Math.Round(amountBeforeVat * (vatRate / 100m), 2);
            var totalAmount = amountBeforeVat + vatAmount;
            var user = await _context.Users.Find(u => u.Id == userId).FirstOrDefaultAsync();
            var quote = new QuoteModel
            {
                CreatedBy = new CreatedBy
                {
                    UserId = userId,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                },
                BusinessIdName= businessIdName,
                QuoteNumber = quoteNumber,
                Date = dto.Date,
                FirstResponse = new FirstResponse
                {
                    Id = user.Id,
                    FirstName = user.FirstName,
                    LastName = user.LastName
                },
                AmountBeforeVat = amountBeforeVat,
                VatRate = vatRate,
                VatAmount = vatAmount,
                TotalAmount = totalAmount,
                IsDeleted = IsDeleted.Active,
                Services = dto.Services.Select(s => new QuoteServiceItem
                {
                    ServiceName = s.ServiceName,
                    Description = s.Description,
                    Amount = s.Amount
                }).ToList(),
            };

            await _quote.InsertOneAsync(quote);
            return quote.Id;
        }
        /// <summary>
        /// returns a paginated list of quotes based on the provided parameters.
        /// </summary>
        /// <param name="role"></param>
        /// <param name="userId"></param>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <param name="searchTerm"></param>
        /// <param name="criteria"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        /// <exception cref="ArgumentException"></exception>
        /// <exception cref="Exception"></exception>
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
            if (role != UserRole.Admin.ToString())
            {
                filters.Add("CreatedBy.UserId", new ObjectId(userId));
            }
            filters.Add("IsDeleted", new BsonDocument("$ne", IsDeleted.Inactive));
            if (!string.IsNullOrEmpty(criteria) && !string.IsNullOrEmpty(value))
            {

                filters.Add($"{criteria}._id", new ObjectId(value));

            }

            if (!string.IsNullOrEmpty(search))
            {
                filters.Add("$or", new BsonArray
                {
                    new BsonDocument("IdByName.Name", new BsonDocument { { "$regex", search }, { "$options", "i" } }),
                    new BsonDocument("FirstResponse.Name", new BsonDocument { { "$regex", search }, { "$options", "i" } })
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

        /// <summary>
        /// Retrieves a quote by its ID
        /// </summary>
        /// <param name="quoteId"></param>
        /// <returns></returns>
        /// <exception cref="ArgumentException"></exception>
        /// <exception cref="Exception"></exception>
        public async Task<GetQuote> GetQuoteById(string quoteId)
        {
            if (string.IsNullOrEmpty(quoteId))
            {
                throw new ArgumentException("Quote ID cannot be null or empty.");
            }

            var pipeline = new BsonDocument[]
{
                // Match the quote by its ObjectId
                new BsonDocument("$match", new BsonDocument("_id", new ObjectId(quoteId))),

                // Lookup matching client details using BusinessIdName._id
                new BsonDocument("$lookup", new BsonDocument
                {
                    { "from", "Clients" },
                    { "localField", "BusinessIdName._id" },
                    { "foreignField", "_id" },
                    { "as", "BusinessDetails" }
                }),

                // Unwind BusinessDetails to get it as a single object
                new BsonDocument("$unwind", "$BusinessDetails"),

                // Rename _id fields to match your DTO
                new BsonDocument("$project", new BsonDocument
                {
                    { "_id", 1 },
                    {"BusinessDetails._id", "$BusinessDetails._id" },
                    { "BusinessDetails.BusinessName", "$BusinessDetails.BusinessName" },
                    { "BusinessDetails.Type", "$BusinessDetails.Type" },
                    { "BusinessDetails.Address", "$BusinessDetails.Address" },

                    // Quote fields
                    {"FirstResponse", 1 },
                    { "QuoteNumber", 1 },
                    { "Services", 1 },
                    { "AmountBeforeVat", 1 },
                    { "VatAmount", 1 },
                    { "VatRate", 1 },
                    { "TotalAmount", 1 },
                    { "QuoteStatus", 1 },
                    { "Date", 1 },
                })
                };


            var result = await _quote.Aggregate<GetQuote>(pipeline).FirstOrDefaultAsync();
            return result;
        }


        /// <summary>
        /// Represents statistical data related to quotes, including totals and percentages for different statuses.
        /// </summary>

        public class QuoteStats
        {
            public int TotalQuotes { get; set; }
            public decimal TotalAmount { get; set; }
            public decimal TotalDrafted { get; set; }
            public decimal DraftedPercentage { get; set; }
            public decimal AcceptedPercentage { get; set; }
            public decimal RejectedPercentage { get; set; }

            public decimal TotalAccepted { get; set; }
            public decimal TotalRejected { get; set; }
        }
        /// <summary>
        /// rtrieves statistics about quotes, including total counts, amounts, and percentages for different statuses.
        /// </summary>
        /// <returns></returns>
        public async Task<QuoteStats?> GetQuoteStats(string role, string userId)
        {
            var filter = Builders<QuoteModel>.Filter.Empty;
            if(role != UserRole.Admin.ToString())
            {
                filter = Builders<QuoteModel>.Filter.Eq(q => q.CreatedBy.UserId, userId);
            }
            filter = Builders<QuoteModel>.Filter.And(
                filter,
                Builders<QuoteModel>.Filter.Ne(q => q.IsDeleted, IsDeleted.Inactive)
            );
            var quote = await _quote.Aggregate<QuoteModel>()
                .Match(filter)
                .ToListAsync();
            if (quote == null || !quote.Any())
            {
                return new QuoteStats();
            }
            var totalQuotes = quote.Count;
            var totalAmount = quote.Sum(q => q.TotalAmount);
            var totalDrafted = quote.Sum(q => q.QuoteStatus == Enums.QuoteStatus.Drafted? q.TotalAmount: 0);
            var totalAccepted = quote.Sum(q => q.QuoteStatus == Enums.QuoteStatus.Accepted? q.TotalAmount: 0);
            var totalRejected = quote.Sum(q => q.QuoteStatus == Enums.QuoteStatus.Rejected? q.TotalAmount: 0);  
            var DrafterPercentage = totalDrafted * 100 / totalAmount;
            var AcceptedPercentage = totalAccepted * 100 / totalAmount;
            var RejectedPercentage = totalRejected * 100 / totalAmount;

            return new QuoteStats
            {
                TotalQuotes = totalQuotes,
                TotalAmount = totalAmount,
                TotalDrafted = totalDrafted,
                DraftedPercentage = DrafterPercentage,
                AcceptedPercentage = AcceptedPercentage,
                RejectedPercentage = RejectedPercentage,
                TotalAccepted = totalAccepted,
                TotalRejected = totalRejected
            };

        }
        /// <summary>
        /// Updates an existing quote with the provided details.
        /// </summary>
        /// <param name="quote"></param>
        /// <param name="userId"></param>
        /// <param name="role"></param>
        /// <param name="quoteId"></param>
        /// <returns>returns the success message</returns>
        /// <exception cref="Exception"></exception>
        public async Task<string> UpdateQuoteAsync(QuoteModel quote, string userId, string role, string quoteId)
        {
            try
            {
                if (!Enum.TryParse<UserRole>(role, true, out var parsedRole))
                {
                    return "Invalid role.";
                }

                if (parsedRole != UserRole.Admin)
                {
                    var existingQuote = await _quote.Find(c => c.Id == quoteId && c.CreatedBy.UserId == userId).FirstOrDefaultAsync();
                    if (existingQuote == null)
                    {
                        return "You do not have permission to update this client.";
                    }
                }

                var businessIdName = await _context.Clients.Find(c => c.BusinessName == quote.BusinessIdName.Name).Project(c => new IdByName
                {
                    Id = c.Id,
                    Name = c.BusinessName
                }).FirstOrDefaultAsync();

                if (businessIdName == null)
                {
                    throw new ArgumentException("Business not found.");
                }


                var filter = Builders<QuoteModel>.Filter.Eq(
                  c => c.Id, quoteId
                );



                var update = Builders<QuoteModel>.Update
                    .Set(c => c.BusinessIdName, businessIdName)
                    .Set(c => c.FirstResponse, quote.FirstResponse)

                    .Set(c => c.AmountBeforeVat, quote.AmountBeforeVat)
                    .Set(c => c.VatRate, quote.VatRate)
                    .Set(c => c.VatAmount, quote.VatAmount)
                    .Set(c => c.TotalAmount, quote.TotalAmount)
                    .Set(c => c.QuoteStatus, quote.QuoteStatus)
                    .Set(c => c.Services, quote.Services);

                var result = await _quote.UpdateOneAsync(filter, update);

                if (result.MatchedCount == 0)
                {
                    return "No quote found to update.";
                }

                return "Quote updated successfully";
            }
            catch (Exception ex)
            {
                throw new Exception($"Error updating quote: {ex}");
            }
        }
        /// <summary>
        /// method to soft delete a client by setting its IsDeleted property to Inactive.
        /// </summary>
        /// <param name="quoteId"></param>
        /// <param name="userId"></param>
        /// <param name="role"></param>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        public async Task<string> DeleteClientAsync(string quoteId, string userId, string role)
        {
            try
            {
                if (role != UserRole.Admin.ToString())
                {
                    var existingClient = await _quote.Find(c => c.Id == quoteId && c.CreatedBy.UserId == userId).FirstOrDefaultAsync();
                    if (existingClient == null)
                    {
                        return "You do not have permission to update this client.";
                    }
                }
                var filter = Builders<QuoteModel>.Filter.Eq(c => c.Id, quoteId);
                var result = await _quote.UpdateOneAsync(filter, Builders<QuoteModel>.Update.Set(x => x.IsDeleted, IsDeleted.Inactive));
                if (result.ModifiedCount == 0)
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
