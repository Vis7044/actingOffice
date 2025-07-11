using backend.Enums;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models
{
    public class QuoteModel
    {
        [BsonId]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        public string BusinessName { get; set; } = string.Empty;

        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string BusinessId { get; set; } = string.Empty;

        public DateOnly Date { get; set; } = DateOnly.FromDateTime(DateTime.UtcNow);

        public string QuoteNumber { get; set; } = string.Empty;

        public string FirstResponse { get; set; } = string.Empty;

        public List<QuoteServiceItem> Services { get; set; }

        [BsonElement("userId")]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string UserId { get; set; } = string.Empty;  

        public decimal AmountBeforeVat { get; set; } = 0.0m;

        public decimal VatAmount { get; set; } = 0.0m;

        public decimal VatRate { get; set; } = 0.0m;
        [BsonRepresentation(MongoDB.Bson.BsonType.String)]
        public QuoteStatus QuoteStatus { get; set; } = QuoteStatus.Drafted;
        public decimal TotalAmount { get; set; } = 0.0m;
        [BsonIgnore]
        [BsonElement("businessDetails")]    
        public ClientModel BusinessDetails { get; set; }
    }

    public class QuoteServiceItem
    {
        public string ServiceName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Amount { get; set; }
    }
}
