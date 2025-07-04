using MongoDB.Bson.Serialization.Attributes;

namespace backend.Dtos.ClientDto
{
    public class ClientHistoryDto
    {
        public string Type { get; set; } = string.Empty;
        public string ClientId { get; set; } = string.Empty;
    }
}
