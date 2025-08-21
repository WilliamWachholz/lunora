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


var jwtSecretKey = Environment.GetEnvironmentVariable("JWT_SECRET") 
    ?? builder.Configuration["JwtSettings:SecretKey"];
    

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
                Encoding.UTF8.GetBytes(jwtSecretKey))
        };

        options.MapInboundClaims = false;
        options.TokenValidationParameters.NameClaimType = "name";
    });

var environment = builder.Environment.EnvironmentName;

var activeDatabase = Environment.GetEnvironmentVariable("ACTIVE_DATABASE") 
    ?? builder.Configuration["ConnectionStrings:ActiveDatabase"];
    

var postgreConnection = Environment.GetEnvironmentVariable("DATABASE_URL") 
    ?? builder.Configuration.GetConnectionString("PostgreSql");

var sqlServerConnection = Environment.GetEnvironmentVariable("DATABASE_URL") 
    ?? builder.Configuration.GetConnectionString("SqlServer");


if (activeDatabase == "PostgreSql")
{
    builder.Services.AddDbContext<LunoraContext>(options =>
        options.UseNpgsql(postgreConnection));
}
else
{
    builder.Services.AddDbContext<LunoraContext>(options =>
        options.UseSqlServer(sqlServerConnection));
}



builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        builder => builder.WithOrigins("http://localhost:4200", "https://lunora.netlify.app")
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

app.MapControllers();

app.Run();

