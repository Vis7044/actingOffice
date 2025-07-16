using backend.Enums;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models
{
    public class ClientModel
    {
        /// <summary>
        /// unique identifier for the client
        /// </summary>
        [BsonId]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;
        /// <summary>
        /// unique and randomly generated client id,
        /// </summary>
        public string? ClientId { get; set; } = string.Empty;
        /// <summary>
        /// stores the business name 
        /// </summary>
        public string BusinessName { get; set; } = string.Empty;
        /// <summary>
        /// Enum to indicate the type of business,
        /// </summary>
        public BusinessType Type { get; set; } = BusinessType.Individual;
        /// <summary>
        /// Gets or sets the client's address.
        /// </summary>
        public ClientAddress Address { get; set; }
        /// <summary>
        /// stores the creator information,
        /// </summary>
        public CreatedBy? CreatedBy { get; set; }
        /// <summary>
        /// used to implement soft delete functionality,    
        /// </summary>
        public IsDeleted IsDeleted { get; set; } = IsDeleted.Active;

    }

    public class ClientAddress
    {
        /// <summary>
        /// stores the building name or number, 
        /// </summary>
        public string Building { get; set; } = string.Empty;
        /// <summary>
        /// stores the street name or number, 
        /// </summary>
        [BsonIgnoreIfDefault, BsonIgnoreIfNull]
        public string Street { get; set; } = string.Empty;
        /// <summary>
        /// stores the city name,
        /// </summary>
        public string City { get; set; } = string.Empty;
        /// <summary>
        /// stores the state or region name
        /// </summary>
        public string State { get; set; } = string.Empty;
        /// <summary>
        /// PinCode` is a string to accommodate alphanumeric postal codes
        /// </summary>
        public string PinCode { get; set; } = string.Empty;
        /// <summary>
        /// stores the country name
        /// </summary>
        public string Country { get; set; } = string.Empty;
    }

}
