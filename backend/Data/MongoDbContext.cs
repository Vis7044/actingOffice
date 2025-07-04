using backend.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace backend.Data
{
    public class MongoDbContext
    {
        private readonly IMongoDatabase _database;
        private readonly DbSetting _dbSetting;
        public MongoDbContext(IOptions<DbSetting> options) {
            _dbSetting = options.Value;
            var client = new MongoClient(_dbSetting.ConnectionString);
            _database = client.GetDatabase(_dbSetting.DatabaseName);
        }

        public IMongoCollection<UserModel> Users => 
            _database.GetCollection<UserModel>(_dbSetting.UserCollectionName);

        public IMongoCollection<ClientModel> Clients => _database
            .GetCollection<ClientModel>(_dbSetting.ClientCollectionName);
        public IMongoCollection<Counter> Counters => _database
            .GetCollection<Counter>("Counters");

        public IMongoCollection<ClientHistory> ClientHistory => _database
            .GetCollection<ClientHistory>("ClientHistory"); 

    }
}
