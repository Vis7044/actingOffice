using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models
{
    public class Service
    {
        [BsonId]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Amount { get; set; } = 0.0m;
        public CreatedBy? CreatedBy { get; set; } 
    }
}
