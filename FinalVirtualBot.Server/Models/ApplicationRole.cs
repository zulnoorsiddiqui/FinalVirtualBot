using AspNetCore.Identity.MongoDbCore.Models;
using MongoDbGenericRepository.Attributes;

namespace UserAuthentication.Models
{
   
        [CollectionName("roles")]
        public class ApplicationRole : MongoIdentityRole<Guid>
        {

        }
    
}
