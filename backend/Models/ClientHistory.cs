using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models
{
    public class ClientHistory
    {
        [BsonId]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        public DateTime DateTime { get; set; } = DateTime.UtcNow;

        public string Type { get; set; } = string.Empty;
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string ClientId { get; set; } = string.Empty;    


    }
}
