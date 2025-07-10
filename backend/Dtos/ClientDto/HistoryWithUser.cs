using backend.Models;

namespace backend.Dtos.ClientDto
{
    public class HistoryWithUser
    {
        
        public History History { get; set; }
        public UserModel User { get; set; }
        

    }
}
