using backend.Enums;
using backend.Models;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Dtos.QuoteDto
{
    public class GetQuote
    {
        [BsonId]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;
        public string QuoteNumber { get; set; } = string.Empty;

        public List<QuoteServiceItem>? Services { get; set; }
        public decimal AmountBeforeVat { get; set; } = 0.0m;

        public decimal VatAmount { get; set; } = 0.0m;
        public DateTime Date { get; set; }

        public decimal VatRate { get; set; } = 0.0m;
        public QuoteStatus QuoteStatus { get; set; } = QuoteStatus.Drafted;
        public decimal TotalAmount { get; set; } = 0.0m;
        public BusinessDetails? BusinessDetails { get; set; }   
        public FirstResponse? FirstResponse { get; set; }
    }

    public class BusinessDetails
    {
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;
        public string BusinessName { get; set; } = string.Empty;
        public BusinessType Type { get; set; } = BusinessType.Individual;
        public ClientAddress? Address { get; set; }
    }
}
