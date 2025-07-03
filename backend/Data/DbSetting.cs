namespace backend.Data
{
    public class DbSetting
    {
        public string ConnectionString { get; set; } = string.Empty;
        public string DatabaseName { get; set; } = string.Empty;
        public string UserCollectionName { get; set; } = string.Empty;
        
        public string ClientCollectionName { get; set; } = string.Empty;
    }
}
