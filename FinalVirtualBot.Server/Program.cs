using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using UserAuthentication.Services;
using UserAuthentication.Models;
using MongoDB.Driver;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using AspNetCore.Identity.MongoDbCore.Extensions;
using AspNetCore.Identity.MongoDbCore.Infrastructure;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebSockets;
using System.Net.WebSockets;
using UserAuthentication.Repository;
using System.Text.Json;
using Google.Api;


var builder = WebApplication.CreateBuilder(args);
builder.Logging.ClearProviders();
builder.Logging.AddConsole();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        builder => builder.AllowAnyOrigin()
                          .AllowAnyMethod()
                          .AllowAnyHeader());
});
builder.Services.AddSingleton<DialogflowService>(provider =>
{

    return new DialogflowService("task-agent-xoqj", @"Credential.json");
});

// Register the DialogflowService using the factory(concept of FACTORY DI as given in task)
builder.Services.AddSingleton<IDialogflowService>(provider =>
{
    var projectId = "task-agent-xoqj"; // Or fetch from configuration
    return DialogflowServiceFactory.Create(projectId);
});

// Register MongoDB client and database (establishing the connection throughout the application)
builder.Services.AddSingleton<IMongoClient>(sp =>
{
    return new MongoClient("mongodb+srv://zulnoor123:zulnoor123@zulnoor.z5zlegq.mongodb.net/?retryWrites=true&w=majority&appName=ZULNOOR");
});

builder.Services.AddScoped<IMongoDatabase>(sp =>
{
    var client = sp.GetRequiredService<IMongoClient>();
    return client.GetDatabase("CrudOperation");
});

// Register BotConfigRepository
builder.Services.AddScoped<IBotConfigRepository, BotConfigRepository>();
//services.AddSingleton<IBotConfigRepository, BotConfigRepository>();
// Add services to the container.

var mongoDbIdentityConfig = new MongoDbIdentityConfiguration
{
    MongoDbSettings = new MongoDbSettings
    {
        ConnectionString = "mongodb+srv://zulnoor123:zulnoor123@zulnoor.z5zlegq.mongodb.net/?retryWrites=true&w=majority&appName=ZULNOOR",
        DatabaseName = "CrudOperation"
    },
    IdentityOptionsAction = options =>
    {
        options.Password.RequireDigit = false;
        options.Password.RequiredLength = 8;
        options.Password.RequireNonAlphanumeric = true;
        options.Password.RequireLowercase = false;

        // Lockout settings
        options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(10);
        options.Lockout.MaxFailedAccessAttempts = 5;

        options.User.RequireUniqueEmail = true;
    }
};

builder.Services.ConfigureMongoDbIdentity<ApplicationUser, ApplicationRole, Guid>(mongoDbIdentityConfig)
    .AddUserManager<UserManager<ApplicationUser>>()
    .AddSignInManager<SignInManager<ApplicationUser>>()
    .AddRoleManager<RoleManager<ApplicationRole>>()
    .AddDefaultTokenProviders();

// JWT Authentication configuration
builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(x =>
{
    x.RequireHttpsMetadata = true;
    x.SaveToken = true;
    x.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidIssuer = "https://localhost:5001",
        ValidAudience = "https://localhost:5001",
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("thisis the secret key hello hello1234567890@!@!@ the secret key the best of all")),
        ClockSkew = TimeSpan.Zero
    };
});


builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configuration of WebSockets
builder.Services.AddWebSockets(options =>
{
    options.KeepAliveInterval = TimeSpan.FromMinutes(2); // Set the keep-alive interval
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

// Enable WebSocket support
app.UseWebSockets();

// WebSocket request handling
app.Use(async (context, next) =>
{
    if (context.Request.Path == "/ws")
    {
        if (context.WebSockets.IsWebSocketRequest)
        {
            using (var webSocket = await context.WebSockets.AcceptWebSocketAsync())
            {
                await HandleWebSocketConnection(webSocket); // Custom method to handle WebSocket communication
            }
        }
        else
        {
            context.Response.StatusCode = 400; // Return 400 Bad Request if it's not a WebSocket request
        }
    }
    else
    {
        await next();
    }
});


//app.UseRouting();

//app.UseAuthentication();
//app.UseAuthorization();

//app.UseHttpsRedirection();

//if (app.Environment.IsDevelopment())
//{
//    app.UseSwagger();
//    app.UseSwaggerUI();
//}

//app.MapControllers();

//app.Run();
async Task HandleWebSocketConnection(WebSocket webSocket)
{
    var buffer = new byte[1024 * 4]; // Buffer size for messages
    var result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

    while (!result.CloseStatus.HasValue)
    {
        // Receive and parse the message from the WebSocket client
        var receivedMessage = Encoding.UTF8.GetString(buffer, 0, result.Count);

        // Assume the message is a plain text string (you can modify this to JSON if needed)
        Console.WriteLine("Received message: " + receivedMessage);

        // Step 2: Use DialogflowService to process the received message
        var dialogflowService = new DialogflowService("task-agent-xoqj", @"Credential.json");
        var sessionId = "SESSION_ID"; // You should generate or manage session IDs appropriately
        var dialogflowResponse = dialogflowService.DetectIntent(sessionId, receivedMessage);

        // Step 3: Prepare the response (combine fulfillment text and any custom payload)
        var responseMessage = new
        {
            dialogflowResponse.FulfillmentTexts,
            dialogflowResponse.Payload,
            dialogflowResponse.IntentName
        };

        // Step 4: Send the response back to the WebSocket client
        var responseMessageJson = JsonSerializer.Serialize(responseMessage);
        var responseBytes = Encoding.UTF8.GetBytes(responseMessageJson);

        await webSocket.SendAsync(new ArraySegment<byte>(responseBytes, 0, responseBytes.Length), WebSocketMessageType.Text, true, CancellationToken.None);

        // Continue receiving messages
        result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
    }

    // Close the WebSocket connection
    await webSocket.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, CancellationToken.None);
}
app.UseCors("AllowAllOrigins");
app.UseSwagger();
app.UseSwaggerUI();

app.UseDefaultFiles();
app.UseStaticFiles();


// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{
//    app.UseSwagger();
//    app.UseSwaggerUI();
//}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
