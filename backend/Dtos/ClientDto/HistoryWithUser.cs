using backend.Models;

namespace backend.Dtos.ClientDto
{
    public class HistoryWithUser
    {
        /// <summary>
        /// stores the history of the client,
        /// </summary>
        public History? History { get; set; }
        /// <summary>
        /// stores the creator information of the history,
        /// </summary>
        public UserModel? User { get; set; }
        
    }
}
