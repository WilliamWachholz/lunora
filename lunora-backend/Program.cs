using Microsoft.EntityFrameworkCore;
using LunoraBackend.DAO;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
            ValidAudience = builder.Configuration["JwtSettings:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:SecretKey"]))
        };

        options.MapInboundClaims = false;
        options.TokenValidationParameters.NameClaimType = "name";
    });

builder.Services.AddDbContext<LunoraContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("constring"));
});



builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        builder => builder.WithOrigins("http://localhost:4200")
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials()
                          .WithExposedHeaders("Authorization"));
                          
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseHttpsRedirection();

app.UseRouting();

app.UseCors("AllowAngular");

app.UseAuthentication();
app.UseAuthorization();


app.Use(async (context, next) =>
{
    var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();
    
    // Log the incoming request
    logger.LogInformation("Request: {Method} {Path}", context.Request.Method, context.Request.Path);
    
    // Check authorization header
    var authHeader = context.Request.Headers["Authorization"].ToString();
    logger.LogInformation("Authorization Header: {AuthHeader}", authHeader);
    
    // Check if we have a token
    if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer "))
    {
        var token = authHeader.Substring(7);
        logger.LogInformation("JWT Token: {Token}", token);
        
        // Try to decode the token manually to see what's in it
        try
        {
            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);
            logger.LogInformation("Token Claims:");
            foreach (var claim in jwtToken.Claims)
            {
                logger.LogInformation("  {Type}: {Value}", claim.Type, claim.Value);
            }
            logger.LogInformation("Token Issuer: {Issuer}", jwtToken.Issuer);
            logger.LogInformation("Token Audience: {Audience}", jwtToken.Audiences?.FirstOrDefault());
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to decode JWT token");
        }
    }
    
    await next();
    
    // After authentication middleware runs
    logger.LogInformation("After authentication - IsAuthenticated: {IsAuth}", context.User.Identity?.IsAuthenticated);
    if (context.User.Identity?.IsAuthenticated == true)
    {
        logger.LogInformation("User Claims after auth:");
        foreach (var claim in context.User.Claims)
        {
            logger.LogInformation("  {Type}: {Value}", claim.Type, claim.Value);
        }
    }
});

app.MapControllers();

app.Run();

