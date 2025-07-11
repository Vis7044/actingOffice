using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models
{
    public class Service
    {
        [BsonId]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;
        [BsonElement("name")]
        public string Name { get; set; } = string.Empty;
        [BsonElement("description")]
        public string Description { get; set; } = string.Empty;
        [BsonElement("amount")]
        public decimal Amount { get; set; } = 0.0m;

        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        [BsonElement("userId")]
        public string? UserId { get; set; } 
    }
}
