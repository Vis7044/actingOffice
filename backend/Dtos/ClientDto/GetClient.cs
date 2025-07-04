namespace backend.Dtos.ClientDto
{
    public class GetClient
    {
        public string Id { get; set; }  = string.Empty;
        public string BusinessName { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public ClientAddressDto Address { get; set; } = new();
        public DateTime CreatedAt { get; set; }
        
    }
}
