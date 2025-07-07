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

        public string FristResponse { get; set; } = string.Empty;     
        public List<QuoteServiceItem> Services { get; set; } 

    }

    public class QuoteServiceItem
    {
        public string ServiceName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Amount { get; set; }
    }
}
