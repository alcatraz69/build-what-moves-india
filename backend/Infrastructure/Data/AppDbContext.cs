using backend.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Applicant> Applicants => Set<Applicant>();

    public DbSet<LicenceJourney> LicenceJourneys => Set<LicenceJourney>();

    public DbSet<JourneyStep> JourneySteps => Set<JourneyStep>();

    public DbSet<Requirement> Requirements => Set<Requirement>();

    public DbSet<Licence> Licences => Set<Licence>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Applicant>()
            .HasOne(x => x.LicenceJourney)
            .WithOne(x => x.Applicant)
            .HasForeignKey<LicenceJourney>(x => x.ApplicantId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<LicenceJourney>()
            .HasMany(x => x.Steps)
            .WithOne(x => x.Journey)
            .HasForeignKey(x => x.JourneyId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<JourneyStep>()
            .HasMany(x => x.Requirements)
            .WithOne(x => x.JourneyStep)
            .HasForeignKey(x => x.JourneyStepId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Applicant>()
            .HasMany(x => x.Licences)
            .WithOne(x => x.Applicant)
            .HasForeignKey(x => x.ApplicantId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}