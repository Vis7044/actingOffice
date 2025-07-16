using backend.Enums;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models
{
    public class Service
    {
        /// <summary>
        /// unique identifier for the service
        /// </summary>
        [BsonId]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;
        /// <summary>
        /// service name
        /// </summary>
        public string Name { get; set; } = string.Empty;
        /// <summary>
        /// description of the service  
        /// </summary>
        public string Description { get; set; } = string.Empty;
        /// <summary>
        /// amount charged for the service  
        /// </summary>
        public decimal Amount { get; set; } = 0.0m;
        /// <summary>
        /// creator information of the service
        /// </summary>
        public CreatedBy? CreatedBy { get; set; } 

        public IsDeleted IsDeleted { get; set; } = IsDeleted.Active;
    }
}
