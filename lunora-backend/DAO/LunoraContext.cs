using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using LunoraBackend.Models;

namespace LunoraBackend.DAO;

public partial class LunoraContext : DbContext
{
    public LunoraContext()
    {
    }

    public LunoraContext(DbContextOptions<LunoraContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users{ get; set; }

    public DbSet<Order> Orders { get; set; }

    public DbSet<Product> Products { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
