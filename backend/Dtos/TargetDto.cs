using MongoDB.Bson.Serialization.Attributes;

namespace backend.Dtos
{
    public class TargetDto
    {
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]    
        public string Id { get; set; } = string.Empty;

        [BsonElement("name")]
        public string Name { get; set; }    
    }
}
