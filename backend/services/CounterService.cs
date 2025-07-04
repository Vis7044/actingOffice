using backend.Data;
using backend.Models;
using MongoDB.Driver;

namespace backend.services
{
    public class CounterService
    {
        private readonly MongoDbContext _context;

        public CounterService(MongoDbContext context)
        {
            _context = context;
        }


        public async Task<int> GetNextSequenceAsync(string sequenceName)
        {
            var filter = Builders<Counter>.Filter.Eq(c => c.Id, sequenceName);
            var update = Builders<Counter>.Update.Inc(c => c.Value, 1);

            var options = new FindOneAndUpdateOptions<Counter>
            {
                IsUpsert = true, // if not exists, create it
                ReturnDocument = ReturnDocument.After
            };

            var updatedCounter = await _context.Counters.FindOneAndUpdateAsync(filter, update,options);
            return updatedCounter.Value;
        }
    }
}
