using backend.Enums;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models
{
    public class ClientModel
    {
        [BsonId]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;
        public string? ClientId { get; set; } = string.Empty;
        public string BusinessName { get; set; } = string.Empty;
        public BusinessType Type { get; set; } = BusinessType.Individual;
        public ClientAddress Address { get; set; }
       public CreatedBy? CreatedBy { get; set; }
        public IsDeleted IsDeleted { get; set; } = IsDeleted.Active;

    }

    public class ClientAddress
    {
        public string Building { get; set; } = string.Empty;
        [BsonIgnoreIfDefault, BsonIgnoreIfNull]
        public string Street { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string PinCode { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
    }

}
