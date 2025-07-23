using backend.Data;
using backend.Dtos.QuoteDto;
using backend.Enums;
using backend.helper;
using backend.Models;
using backend.services.interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using MongoDB.Bson;
using MongoDB.Driver;
using System.Reflection.Metadata;

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
            _quote = context.Quote; 
            _counter = counter; 
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
                    Id = dto.FirstResponse!.Id,
                    FirstName = dto.FirstResponse.FirstName,
                    LastName = dto.FirstResponse.LastName
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
        public async Task<PageResult<QuoteModel>> GetQouteAsync(
    string role, string userId, int page, int pageSize,
    string searchTerm, string criteria, string value, string IsDeleted)
        {
            if (page < 1 || pageSize < 1)
            {
                throw new ArgumentException("Page and page size must be greater than 0.");
            }

            var builder = Builders<QuoteModel>.Filter;
            var filter = builder.Empty;

            // Role-based filter
            if (role != UserRole.Admin.ToString())
            {
                filter &= builder.Eq(q => q.CreatedBy!.UserId, userId);
            }

            
            if (!string.IsNullOrEmpty(criteria) && !string.IsNullOrEmpty(value))
            {
                if(criteria == "FirstResponse")
                {
                    filter &= builder.Eq($"{criteria}._id", new ObjectId(value));
                }
                else if(criteria == "QuoteStatus" && value!="All")
                {
                    if (Enum.TryParse<QuoteStatus>(value, true, out var status))
                    {
                        filter &= builder.Eq(q => q.QuoteStatus, status);
                    }
                    else
                    {
                        throw new ArgumentException("Invalid QuoteStatus value.");
                    }
                }
                else
                {
                    throw new ArgumentException("Invalid criteria specified.");
                }
            }

            // IsDeleted filter
            if (!string.Equals(IsDeleted, "All", StringComparison.OrdinalIgnoreCase))
            {
                if (Enum.TryParse<IsDeleted>(IsDeleted, out var deleted))
                {
                    filter &= builder.Eq(q => q.IsDeleted,deleted);
                }
                else
                {
                    throw new ArgumentException("Invalid delete type value.");
                }
            }

            // Search filters
            if (!string.IsNullOrEmpty(searchTerm))
            {
                var search = searchTerm.Trim();
                var searchFilter = builder.Or(
                    builder.Regex("BusinessIdName.Name", new BsonRegularExpression(search, "i")),
                    builder.Regex("FirstResponse.FirstName", new BsonRegularExpression(search, "i"))
                );

                filter &= searchFilter;
            }

            var sort = Builders<QuoteModel>.Sort.Descending(q => q.Date);

            try
            {
                var quotes = await _quote
                    .Find(filter)
                    .Sort(sort)
                    .Skip((page - 1) * pageSize)
                    .Limit(pageSize)
                    .ToListAsync();

                var totalCount = await _quote.CountDocumentsAsync(filter);

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
                filter = Builders<QuoteModel>.Filter.Eq(q => q.CreatedBy!.UserId, userId);
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
            var DrafterPercentage = Math.Round(totalDrafted * 100 / totalAmount,2);
            var AcceptedPercentage = Math.Round(totalAccepted * 100 / totalAmount,2);
            var RejectedPercentage = Math.Round(totalRejected * 100 / totalAmount,2);

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
                    var existingQuote = await _quote.Find(c => c.Id == quoteId && c.CreatedBy!.UserId == userId).FirstOrDefaultAsync();
                    if (existingQuote == null)
                    {
                        return "You do not have permission to update this client.";
                    }
                }

                var businessIdName = await _context.Clients.Find(c => c.BusinessName == quote.BusinessIdName!.Name).Project(c => new IdByName
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
                    .Set(c => c.Date, quote.Date)
                    .Set(c => c.AmountBeforeVat, quote.AmountBeforeVat)
                    .Set(c => c.VatRate, quote.VatRate)
                    .Set(c => c.VatAmount, quote.VatAmount)
                    .Set(c => c.TotalAmount, quote.TotalAmount)
                    .Set(c => c.QuoteStatus, quote.QuoteStatus)
                    .Set(c => c.IsDeleted, quote.IsDeleted)
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
                    var existingClient = await _quote.Find(c => c.Id == quoteId && c.CreatedBy!.UserId == userId).FirstOrDefaultAsync();
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

        public async Task<PageResult<QuoteSummaryDto>> GetUsersQuoteStatus(int page, int pageSize)
        {
            if (page < 1 || pageSize < 1)
            {
                throw new ArgumentException("Page and page size must be greater than 0.");
            }
            var skip = (page - 1) * pageSize;

            var groupStage = new BsonDocument("$group",
                new BsonDocument
                {
            { "_id", "$CreatedBy.UserId" },
            { "TotalCount", new BsonDocument("$sum", 1) },
            { "AcceptedCount", new BsonDocument("$sum", new BsonDocument("$cond", new BsonArray {
                new BsonDocument("$eq", new BsonArray { "$QuoteStatus", 0 }), 1, 0 })) },
            { "DraftCount", new BsonDocument("$sum", new BsonDocument("$cond", new BsonArray {
                new BsonDocument("$eq", new BsonArray { "$QuoteStatus", 1 }), 1, 0 })) },
            { "RejectedCount", new BsonDocument("$sum", new BsonDocument("$cond", new BsonArray {
                new BsonDocument("$eq", new BsonArray { "$QuoteStatus", 2 }), 1, 0 })) },
            { "FirstName", new BsonDocument("$first", "$CreatedBy.FirstName") },
            { "LastName", new BsonDocument("$first", "$CreatedBy.LastName") }
                });

            var projectStage = new BsonDocument("$project",
                new BsonDocument
                {
            { "_id", 0 },
            { "FirstName", 1 },
            { "LastName", 1 },
            { "TotalCount", 1 },
            { "AcceptedCount", 1 },
            { "DraftCount", 1 },
            { "RejectedCount", 1 }
                });

            var pipeline = new[]
            {
        groupStage,
        projectStage,
        new BsonDocument("$skip", skip),
        new BsonDocument("$limit", pageSize)
        };

            var result = await _quote.Aggregate<QuoteSummaryDto>(pipeline).ToListAsync();
            //var result2 = result.Skip(skip).Take(pageSize);
            // Count total grouped users
            var countPipeline = new[] { groupStage };
            var totalGroups = await _quote.Aggregate<BsonDocument>(countPipeline).ToListAsync();
            var totalCount = totalGroups.Count;

            return new PageResult<QuoteSummaryDto>
            {
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize,
                Data = result
            };
        }

        /// <summary>
        /// Gets daily quote details for a specific month based on the offset from the current date.
        /// </summary>
        /// <param name="offset"></param>
        /// <returns></returns>
        public async Task<List<DailyQuoteSummary>> GetDailyQuoteDetails(int offset)
        {
            var now = DateTime.UtcNow;
            var targetDate = now.AddMonths(offset);
            var year = targetDate.Year;
            var month = targetDate.Month;

            var startOfMonth = new DateTime(year, month, 1, 0, 0, 0, DateTimeKind.Utc);
            var endOfMonth = startOfMonth.AddMonths(1).AddSeconds(-1);

            var pipeline = new BsonDocument[]
            {
                new BsonDocument("$match", new BsonDocument("Date", new BsonDocument
                {
                    { "$gte",
                    new DateTime(year, month, 1, 0, 0, 0) },
                                { "$lte",
                    new DateTime(year, month, DateTime.DaysInMonth(year, month), 23, 59, 59) }  
                })),
                new BsonDocument("$group", new BsonDocument
                {
                    { "_id", new BsonDocument("$dateToString", new BsonDocument
                        {
                            { "format", "%d" },
                            { "date", "$Date" }
                        })
                    },
                    { "total", new BsonDocument("$sum", 1) }
                }),
                new BsonDocument("$sort", new BsonDocument("_id", 1))
            };

            var result = await _quote.Aggregate<DailyQuoteSummary>(pipeline).ToListAsync();

            
            var daysInMonth = DateTime.DaysInMonth(year, month);
            var completeResult = Enumerable.Range(1, daysInMonth)
                .Select(d => d.ToString("D2"))
                .Select(d => result.FirstOrDefault(r => r.Id == d) ?? new DailyQuoteSummary { Id = d, total = 0 })
                .OrderBy(r => r.Id)
                .ToList();

            return completeResult;
        }
        /// <summary>
        /// Gets the status of user quotes for a specific month based on the offset from the current date.
        /// </summary>
        /// <param name="offset"></param>
        /// <returns></returns>
        public async Task<List<DailyQouteAmountStats>> GetUsersQuoteAmountStatus(int offset)
        {
            var now = DateTime.UtcNow;
            var targetDate = now.AddMonths(offset);
            var year = targetDate.Year;
            var month = targetDate.Month;

            var startOfMonth = new DateTime(year, month, 1, 0, 0, 0, DateTimeKind.Utc);
            var endOfMonth = startOfMonth.AddMonths(1).AddSeconds(-1);

            var pipeline = new BsonDocument[]
            {
                new BsonDocument("$match", new BsonDocument("Date", new BsonDocument
                {
                    { "$gte",
                    new DateTime(year, month, 1, 0, 0, 0) },
                                { "$lte",
                    new DateTime(year, month, DateTime.DaysInMonth(year, month), 23, 59, 59) }
                })),
                new BsonDocument("$group",
                new BsonDocument
                    {
                        { "_id", "$CreatedBy.UserId" },
                        { "TotalCount",
                        new BsonDocument("$sum", 1) },
                                { "AcceptedCount",
                        new BsonDocument("$sum",
                        new BsonDocument("$cond",
                        new BsonArray
                                {
                                    new BsonDocument("$eq",
                                    new BsonArray
                                        {
                                            "$QuoteStatus",
                                            0
                                        }),
                                    "$TotalAmount",
                                    0
                                })) },
                        { "DraftCount",
                        new BsonDocument("$sum",
                        new BsonDocument("$cond",
                        new BsonArray
                                {
                                    new BsonDocument("$eq",
                                    new BsonArray
                                        {
                                            "$QuoteStatus",
                                            1
                                        }),
                                    "$TotalAmount",
                                    0
                                })) },
                        { "RejectedCount",
                        new BsonDocument("$sum",
                        new BsonDocument("$cond",
                        new BsonArray
                                        {
                                    new BsonDocument("$eq",
                                    new BsonArray
                                        {
                                            "$QuoteStatus",
                                            2
                                        }),
                                    "$TotalAmount",
                                    0
                                })) },
                        { "FirstName",
                        new BsonDocument("$first", "$CreatedBy.FirstName") },
                                { "LastName",
                        new BsonDocument("$first", "$CreatedBy.LastName") }
                            }),
                        new BsonDocument("$project",
                        new BsonDocument
                        {
                            { "_id", 0 },
                            { "FirstName", 1 },
                            { "LastName", 1 },
                            { "TotalCount", 1 },
                            { "AcceptedCount", 1 },
                            { "DraftCount", 1 },
                            { "RejectedCount", 1 }
                        }),
                        new BsonDocument("$sort", new BsonDocument("AcceptedCount", -1))
            };

            
            var result = await _quote.Aggregate<QuoteSummaryDto>(pipeline).ToListAsync();

           return result.Select(r => new DailyQouteAmountStats
           {
                Name = $"{r.FirstName} {r.LastName}",
                TotalCountAmount = r.TotalCount.ToString(),
                AcceptedCountAmount = r.AcceptedCount.ToString(),
                DraftCountAmount = r.DraftCount.ToString(),
                RejectedCountAmount = r.RejectedCount.ToString()
            }).ToList();
        }


    }
}
