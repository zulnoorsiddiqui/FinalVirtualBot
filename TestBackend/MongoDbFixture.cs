using Mongo2Go;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TestBackend
{
    public class MongoDbFixture : IDisposable
    {
        private readonly MongoDbRunner _mongoDbRunner;

        public MongoDbFixture()
        {
            _mongoDbRunner = MongoDbRunner.Start(); // Starts a temporary MongoDB instance
        }

        public IMongoDatabase GetDatabase(string databaseName)
        {
            var client = new MongoClient(_mongoDbRunner.ConnectionString);
            return client.GetDatabase(databaseName);
        }

        public void Dispose()
        {
            _mongoDbRunner?.Dispose();
        }
    }
}
