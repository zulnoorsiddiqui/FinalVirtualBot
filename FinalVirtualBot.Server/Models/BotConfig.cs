using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class BotConfig
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }

    public string BotName { get; set; }
    public string Provider { get; set; }
    public string ConfigVersion { get; set; }
    public string JsonServiceAccount { get; set; }
    public string Region { get; set; }
    public string Language { get; set; }
}
