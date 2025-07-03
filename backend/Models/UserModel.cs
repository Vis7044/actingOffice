using backend.Enums;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class UserModel
    {
        [BsonId]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        [Required]
        [BsonElement("firstname")]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [BsonElement("lastname")]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [BsonElement("email")]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [BsonElement("password")]
        public string Password { get; set; } = string.Empty;

        [BsonElement("dateOfBirth")]
        public DateTime? DateOfBirth { get; set; } = null;

        [BsonRepresentation(MongoDB.Bson.BsonType.String)]
        [BsonElement("role")]
        public UserRole Role { get; set; } = UserRole.User; // Default role is User
    }
}
