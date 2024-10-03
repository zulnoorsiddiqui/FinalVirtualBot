﻿using AspNetCore.Identity.MongoDbCore.Models;

using MongoDbGenericRepository.Attributes;

namespace FinalVirtualBot.Server.Models
{
  
        [CollectionName("users")]
        public class ApplicationUser : MongoIdentityUser<Guid>
        {
            public string FullName { get; set; } = string.Empty;
        }

    
}
