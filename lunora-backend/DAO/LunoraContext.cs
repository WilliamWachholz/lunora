using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using LunoraBackend.Models;
using System.Reflection;

namespace LunoraBackend.DAO;

public partial class LunoraContext : DbContext
{
    public LunoraContext()
    {
    }


    private readonly IConfiguration _configuration;

    public LunoraContext(DbContextOptions<LunoraContext> options, IConfiguration configuration)
        : base(options)
    {
        _configuration = configuration;
    }

    public DbSet<User> Users{ get; set; }

    public DbSet<Order> Orders { get; set; }

    public DbSet<OrderItem> OrderItem { get; set; }

    public DbSet<Product> Products { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // if (_configuration["ConnectionStrings:ActiveDatabase"] == "PostgreSql")
        // {
        //     foreach (var entity in modelBuilder.Model.GetEntityTypes())
        //     {
        //         foreach (var property in entity.GetProperties())
        //         {
        //             if (property.ClrType == typeof(string))
        //             {
        //                 property.SetColumnType("text");
        //             }
        //         }
        //     }
        // }

        modelBuilder.Entity<User>();
        modelBuilder.Entity<Product>();
        modelBuilder.Entity<Order>();
        modelBuilder.Entity<OrderItem>();
        

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
