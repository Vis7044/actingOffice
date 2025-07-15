using backend.Enums;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models
{
    public class QuoteModel
    {
        [BsonId]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        public string QuoteNumber { get; set; } = string.Empty;

        public FirstResponse? FirstResponse { get; set; } 

        public List<QuoteServiceItem>? Services { get; set; }
        public CreatedBy? CreatedBy { get; set; }
        public DateTime Date { get; set; } = DateTime.UtcNow;

        public decimal AmountBeforeVat { get; set; } = 0.0m;

        public decimal VatAmount { get; set; } = 0.0m;

        public decimal VatRate { get; set; } = 0.0m;
        public QuoteStatus QuoteStatus { get; set; } = QuoteStatus.Drafted;
        public decimal TotalAmount { get; set; } = 0.0m;
        public IdByName? BusinessIdName { get; set; }

        public IsDeleted IsDeleted { get; set; } = IsDeleted.Active;
    }

    public class QuoteServiceItem
    {
        public string ServiceName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Amount { get; set; }
    }

    public class IdByName
    {
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
    }


    public class FirstResponse
    {
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;   
        public DateTime DateTime { get; set; } = DateTime.UtcNow;
    }
}
