using backend.Enums;
using backend.Models;

namespace backend.Dtos.ClientDto
{
    public class CreateClient
    {
        public string BusinessName { get; set; } = string.Empty;
        public BusinessType Type { get; set; } =BusinessType.Individual;
        public required ClientAddress Address { get; set; } = new();

    }
}
