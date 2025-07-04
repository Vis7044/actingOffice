using backend.Enums;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models
{
    public class ClientModel
    {
        [BsonId]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        [BsonElement("clientId")]
        public string? ClientId { get; set; } = string.Empty;
        [BsonElement("businessName")]   
        public string BusinessName { get; set; } = string.Empty;
        [BsonElement("type")]
        public BusinessType Type { get; set; } = BusinessType.Individual;
        [BsonElement("address")]
        public required ClientAddress Address { get; set; }
    }

    public class ClientAddress
    {
        [BsonElement("building")]
        public string Building { get; set; } = string.Empty;

        [BsonElement("street")]
        public string Street { get; set; } = string.Empty;

        [BsonElement("city")]
        public string City { get; set; } = string.Empty;

        [BsonElement("state")]
        public string State { get; set; } = string.Empty;

        [BsonElement("pinCode")]
        public string PinCode { get; set; } = string.Empty;

        [BsonElement("country")]
        public string Country { get; set; } = string.Empty;
    }

}
