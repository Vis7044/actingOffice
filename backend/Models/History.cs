using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models
{
    public class History
    {
        /// <summary>
        /// unique identifier for the history record    
        /// </summary>
        [BsonId]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;
        /// <summary>
        /// enum to represent the type of action performed in the history
        /// </summary>
        [BsonIgnoreIfDefault]
        public HistoryAction Action { get; set; } = HistoryAction.Unknown;
        /// <summary>
        /// description of the action performed in the history record
        /// </summary>
        public string Description { get; set; } = string.Empty;
        /// <summary>
        /// stores the creator information of the history record
        /// </summary>
        public CreatedBy CreatedBy { get; set; } = new CreatedBy();
        /// <summary>
        /// stores the id and name of the target entity (e.g., client or quote) related to the history record
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
        /// creator's first name
        /// </summary>
        public string FirstName { get; set; } = string.Empty;
        /// <summary>
        /// creator's last name
        /// </summary>
        public string LastName { get; set; } = string.Empty;
        /// <summary>
        /// created date and time of the history record
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
    /// <summary>
    /// enum to represent the type of action performed in the history
    /// </summary>
    public enum HistoryAction
    {
        Unknown,
        Created,
        Updated,
        Deleted
    }
}
