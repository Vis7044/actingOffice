using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models
{
    public class History
    {
        /// <summary>
        /// 
        /// </summary>
        [BsonId]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;
        /// <summary>
        /// 
        /// </summary>
        [BsonIgnoreIfDefault]
        public HistoryAction Action { get; set; } = HistoryAction.Unknown;
        /// <summary>
        /// 
        /// </summary>
        public string Description { get; set; } = string.Empty;
        /// <summary>
        /// 
        /// </summary>
        public CreatedBy? CreatedBy { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public Target? Target { get; set; }


    }
    public class CreatedBy
    {
        /// <summary>
        /// User Id of creator
        /// </summary>
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string UserId { get; set; } = string.Empty;
        /// <summary>
        /// 
        /// </summary>
        public string FirstName { get; set; } = string.Empty;
        /// <summary>
        /// 
        /// </summary>
        public string LastName { get; set; } = string.Empty;
        /// <summary>
        /// 
        /// </summary>
        public DateTime DateTime { get; set; } = DateTime.UtcNow;
    }
    public class Target
    {
        /// <summary>
        /// Clinet Id/ quote Id
        /// </summary>
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;
        /// <summary>
        /// Clinet Name/ quote Name
        /// </summary>
        public string Name { get; set; } = string.Empty;
    }
    public enum HistoryAction
    {
        Unknown,
        Created,
        Updated,
        Deleted
    }
}
