using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models
{
    public class History
    {
        [BsonId]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        [BsonElement("performedOn")]
        public DateTime DateTime { get; set; } = DateTime.UtcNow;

        [BsonElement("action")]
        public string Action { get; set; } = string.Empty;
        [BsonElement("description")]
        public string Description { get; set; } = string.Empty;

        [BsonElement("PerformedBy")]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string UserId { get; set; } = string.Empty;  

        public TargetDto Target { get; set; } = new TargetDto();


    }

    public class TargetDto
    {
        [BsonElement("id")]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        [BsonElement("name")]
        public string Name { get; set; } = string.Empty;
    }
}
