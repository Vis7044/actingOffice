using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models
{
    /// <summary>
    /// used this class to store count values to generate unique numbers for clients, quotes, and services.
    /// </summary>
    public class Counter
    {
        /// <summary>
        /// it will store the name of the counter, to identify which counter it is,
        /// </summary>
        [BsonId]
        [BsonRepresentation(BsonType.String)]
        public string Id { get; set; } = string.Empty;  // e.g. "client"
        /// <summary>
        /// it will store the current value of the counter,
        /// </summary>
        public int Value { get; set; }
    }
}
