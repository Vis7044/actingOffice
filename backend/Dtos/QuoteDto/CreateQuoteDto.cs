namespace backend.Dtos.QuoteDto
{
    public class CreateQuoteDto
    {
        public string BusinessId { get; set; } = string.Empty;
        public string BusinessName { get; set; } = string.Empty;
        public DateOnly Date { get; set; }
        public string FirstResponse { get; set; } = string.Empty;
        public List<QuoteServiceItemDto> Services { get; set; } = new();
    }
}
