using AspNetCore.Identity.MongoDbCore.Models;
using MongoDbGenericRepository.Attributes;

namespace FinalVirtualBot.Server.Models
{
   
        [CollectionName("roles")]
        public class ApplicationRole : MongoIdentityRole<Guid>
        {

        }
    
}
