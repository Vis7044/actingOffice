using backend.Enums;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class UserModel
    {
        /// <summary>
        /// unique identifier for the user
        /// </summary>
        [BsonId]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;
        /// <summary>
        /// first name of the user
        /// </summary>
        public string FirstName { get; set; } = string.Empty;
        /// <summary>
        /// last name of the user
        /// </summary>
        public string LastName { get; set; } = string.Empty;
        /// <summary>
        /// email address of the user
        /// </summary>
        public string Email { get; set; } = string.Empty;
        /// <summary>
        /// password for the user account
        /// </summary>
        public string Password { get; set; } = string.Empty;
        /// <summary>
        /// date of birth of the user
        /// </summary>
        public DateTime? DateOfBirth { get; set; } = null;
        /// <summary>
        /// role of the user in the system
        /// </summary>
        public UserRole Role { get; set; } = UserRole.User; // Default role is User
    }
}
