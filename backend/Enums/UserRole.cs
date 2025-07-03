using System.Text.Json.Serialization;

namespace backend.Enums
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum UserRole
    {
        User,
        Admin,
        Staff,
        Manager
    }
}
