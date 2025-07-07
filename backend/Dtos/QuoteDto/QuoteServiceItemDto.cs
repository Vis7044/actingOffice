namespace backend.Dtos.QuoteDto
{
    public class QuoteServiceItemDto
    {
        public string ServiceName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Amount { get; set; }
    }
}
