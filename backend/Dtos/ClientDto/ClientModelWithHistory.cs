using backend.Dtos.ClientDto;

namespace backend.Models
{
    public class ClientModelWithHistory
    {

        public ClientModel Client { get; set; }
        public List<HistoryWithUser> HistoryWithUsers { get; set; }


    }
}
