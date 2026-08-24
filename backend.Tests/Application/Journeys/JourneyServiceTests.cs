using backend.Application.Journeys;
using backend.Application.Rules;
using backend.Domain.Entities;
using backend.Domain.Enums;
using backend.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using backend.Application.Time;

namespace backend.Tests.Application.Journeys;

public class JourneyServiceTests
{
    [Fact]
    public async Task CreateAsync_WhenApplicantIsEligible_ShouldCreateJourneyWithCorrectSteps()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        await using var dbContext = new AppDbContext(options);

        var applicant = new Applicant
        {
            Id = Guid.NewGuid(),
            Age = 18,
            State = "Karnataka",
            City = "Bengaluru",
            IsFirstLicence = true,
            VehicleTypes =
            [
                VehicleType.MCWG,
                VehicleType.LMV
            ]
        };

        dbContext.Applicants.Add(applicant);
        await dbContext.SaveChangesAsync();

        var eligibilityService = new EligibilityService();

        var journeyService = new JourneyService(
    dbContext,
    eligibilityService,
    new TestClock()
);

        // Act
        var journey = await journeyService.CreateAsync(applicant.Id);

        // Assert
        Assert.NotNull(journey);
        Assert.Equal(JourneyType.FirstDrivingLicence, journey.JourneyType);
        Assert.Equal(JourneyStatus.NotStarted, journey.Status);
        Assert.Equal(JourneyStepType.LlApplication, journey.CurrentStep);

        Assert.Equal(11, journey.Steps.Count);

        var firstStep = journey.Steps
            .OrderBy(step => step.Order)
            .First();

        Assert.Equal(
            JourneyStepType.LlApplication,
            firstStep.Type
        );

        Assert.Equal(
            JourneyStepStatus.Available,
            firstStep.Status
        );

        var remainingSteps = journey.Steps
            .Where(step => step.Order > 1);

        Assert.All(
            remainingSteps,
            step => Assert.Equal(
                JourneyStepStatus.Locked,
                step.Status
            )
        );
    }
    [Fact]
    public async Task CreateAsync_WhenApplicantIsNotEligible_ShouldThrow()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        await using var dbContext = new AppDbContext(options);

        var applicant = new Applicant
        {
            Id = Guid.NewGuid(),
            Age = 17,
            State = "Karnataka",
            City = "Bengaluru",
            IsFirstLicence = true,
            VehicleTypes =
            [
                VehicleType.LMV
            ]
        };

        dbContext.Applicants.Add(applicant);
        await dbContext.SaveChangesAsync();

        var eligibilityService = new EligibilityService();

        var journeyService = new JourneyService(
        dbContext,
        eligibilityService,
        new TestClock()
    );

        // Act & Assert
        var exception = await Assert.ThrowsAsync<InvalidOperationException>(
            () => journeyService.CreateAsync(applicant.Id)
        );

        Assert.Equal(
            "Applicant is not eligible to start a licence journey.",
            exception.Message
        );
    }
    [Fact]
    public async Task CreateAsync_WhenJourneyAlreadyExists_ShouldReturnExistingJourney()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        await using var dbContext = new AppDbContext(options);

        var applicant = new Applicant
        {
            Id = Guid.NewGuid(),
            Age = 18,
            State = "Karnataka",
            City = "Bengaluru",
            IsFirstLicence = true,
            VehicleTypes =
            [
                VehicleType.MCWG
            ]
        };

        dbContext.Applicants.Add(applicant);
        await dbContext.SaveChangesAsync();

        var eligibilityService = new EligibilityService();

        var journeyService = new JourneyService(
         dbContext,
         eligibilityService,
         new TestClock()
     );

        // Act
        var firstJourney = await journeyService.CreateAsync(applicant.Id);
        var secondJourney = await journeyService.CreateAsync(applicant.Id);

        // Assert
        Assert.Equal(firstJourney.Id, secondJourney.Id);

        var journeyCount = await dbContext.LicenceJourneys
            .CountAsync(x => x.ApplicantId == applicant.Id);

        Assert.Equal(1, journeyCount);
    }
    [Fact]
    public async Task CompleteStepAsync_ShouldCompleteCurrentStepAndUnlockNextStep()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        await using var dbContext = new AppDbContext(options);

        var applicant = new Applicant
        {
            Id = Guid.NewGuid(),
            Age = 18,
            State = "Karnataka",
            City = "Bengaluru",
            IsFirstLicence = true,
            VehicleTypes =
            [
                VehicleType.MCWG
            ]
        };

        dbContext.Applicants.Add(applicant);
        await dbContext.SaveChangesAsync();

        var journeyService = new JourneyService(
        dbContext,
        new EligibilityService(),
        new TestClock()
    );
        var journey = await journeyService.CreateAsync(applicant.Id);

        var currentStep = journey.Steps
            .Single(x => x.Type == JourneyStepType.LlApplication);

        CompleteRequiredRequirements(currentStep);

        // Act
        var updatedJourney = await journeyService.CompleteStepAsync(
            journey.Id,
            currentStep.Id,
            JourneyStepResult.Pass
        );

        // Assert
        var completedStep = updatedJourney.Steps
            .Single(x => x.Type == JourneyStepType.LlApplication);

        var nextStep = updatedJourney.Steps
            .Single(x => x.Type == JourneyStepType.LlDocuments);

        Assert.Equal(
            JourneyStepStatus.Completed,
            completedStep.Status
        );

        Assert.Equal(
            JourneyStepStatus.Available,
            nextStep.Status
        );

        Assert.Equal(
            JourneyStepType.LlDocuments,
            updatedJourney.CurrentStep
        );

        Assert.Equal(
            JourneyStatus.InProgress,
            updatedJourney.Status
        );
    }

    [Fact]
    public async Task CompleteStepAsync_WhenCompletingNonCurrentStep_ShouldThrow()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        await using var dbContext = new AppDbContext(options);

        var applicant = new Applicant
        {
            Id = Guid.NewGuid(),
            Age = 18,
            State = "Karnataka",
            City = "Bengaluru",
            IsFirstLicence = true,
            VehicleTypes =
            [
                VehicleType.MCWG
            ]
        };

        dbContext.Applicants.Add(applicant);
        await dbContext.SaveChangesAsync();

        var journeyService = new JourneyService(
            dbContext,
            new EligibilityService(),
            new TestClock()
        );

        var journey = await journeyService.CreateAsync(applicant.Id);

        var lockedStep = journey.Steps
            .Single(x => x.Type == JourneyStepType.LlDocuments);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<InvalidOperationException>(
            () => journeyService.CompleteStepAsync(
                journey.Id,
                lockedStep.Id,
                JourneyStepResult.Pass
            )
        );

        Assert.Equal(
            "Only the current journey step can be completed.",
            exception.Message
        );
    }
    [Fact]
    public async Task CompleteStepAsync_WhenLlTestPasses_ShouldAdvanceToLlIssued()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        await using var dbContext = new AppDbContext(options);

        var applicant = new Applicant
        {
            Id = Guid.NewGuid(),
            Age = 18,
            State = "Karnataka",
            City = "Bengaluru",
            IsFirstLicence = true,
            VehicleTypes =
            [
                VehicleType.MCWG
            ]
        };

        dbContext.Applicants.Add(applicant);
        await dbContext.SaveChangesAsync();

        var journeyService = new JourneyService(
            dbContext,
            new EligibilityService(),
            new TestClock()
        );

        var journey = await journeyService.CreateAsync(applicant.Id);

        // Move through the first four steps
        for (var i = 0; i < 4; i++)
        {
            var currentStep = journey.Steps
                .Single(x => x.Type == journey.CurrentStep);

            CompleteRequiredRequirements(currentStep);


            journey = await journeyService.CompleteStepAsync(
                journey.Id,
                currentStep.Id,
                JourneyStepResult.Pass
            );
        }

        var llTest = journey.Steps
            .Single(x => x.Type == JourneyStepType.LlTest);

        // Act
        var updatedJourney = await journeyService.CompleteStepAsync(
            journey.Id,
            llTest.Id,
            JourneyStepResult.Pass
        );

        // Assert
        var completedTest = updatedJourney.Steps
            .Single(x => x.Type == JourneyStepType.LlTest);

        var llIssued = updatedJourney.Steps
            .Single(x => x.Type == JourneyStepType.LlIssued);

        Assert.Equal(
            JourneyStepStatus.Completed,
            completedTest.Status
        );

        Assert.Equal(
            JourneyStepStatus.Available,
            llIssued.Status
        );

        Assert.Equal(
            JourneyStepType.LlIssued,
            updatedJourney.CurrentStep
        );
    }

    [Fact]
    public async Task CompleteStepAsync_WhenLlTestFails_ShouldMarkStepAsFailed()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        await using var dbContext = new AppDbContext(options);

        var applicant = new Applicant
        {
            Id = Guid.NewGuid(),
            Age = 18,
            State = "Karnataka",
            City = "Bengaluru",
            IsFirstLicence = true,
            VehicleTypes =
            [
                VehicleType.MCWG
            ]
        };

        dbContext.Applicants.Add(applicant);
        await dbContext.SaveChangesAsync();

        var journeyService = new JourneyService(
        dbContext,
        new EligibilityService(),
        new TestClock()
    );

        var journey = await journeyService.CreateAsync(applicant.Id);

        // Move through the first four steps
        for (var i = 0; i < 4; i++)
        {
            var currentStep = journey.Steps
                .Single(x => x.Type == journey.CurrentStep);

            CompleteRequiredRequirements(currentStep);


            journey = await journeyService.CompleteStepAsync(
                journey.Id,
                currentStep.Id,
                JourneyStepResult.Pass
            );
        }

        var llTest = journey.Steps
            .Single(x => x.Type == JourneyStepType.LlTest);

        // Act
        var updatedJourney = await journeyService.CompleteStepAsync(
            journey.Id,
            llTest.Id,
            JourneyStepResult.Fail
        );

        // Assert
        Assert.Equal(
            JourneyStepStatus.Failed,
            updatedJourney.Steps
                .Single(x => x.Type == JourneyStepType.LlTest)
                .Status
        );

        Assert.Equal(
            JourneyStepType.LlTest,
            updatedJourney.CurrentStep
        );

        Assert.Equal(
            JourneyStepStatus.Locked,
            updatedJourney.Steps
                .Single(x => x.Type == JourneyStepType.LlIssued)
                .Status
        );
    }
    [Fact]
    public async Task RetryStepAsync_WhenStepHasFailed_ShouldMakeStepAvailableAgain()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        await using var dbContext = new AppDbContext(options);

        var applicant = new Applicant
        {
            Id = Guid.NewGuid(),
            Age = 18,
            State = "Karnataka",
            City = "Bengaluru",
            IsFirstLicence = true,
            VehicleTypes =
            [
                VehicleType.MCWG
            ]
        };

        dbContext.Applicants.Add(applicant);
        await dbContext.SaveChangesAsync();

        var journeyService = new JourneyService(
        dbContext,
        new EligibilityService(),
        new TestClock()
    );

        var journey = await journeyService.CreateAsync(applicant.Id);

        // Move to LL test
        for (var i = 0; i < 4; i++)
        {
            var currentStep = journey.Steps
                .Single(x => x.Type == journey.CurrentStep);

            CompleteRequiredRequirements(currentStep);


            journey = await journeyService.CompleteStepAsync(
                journey.Id,
                currentStep.Id,
                JourneyStepResult.Pass
            );
        }

        var llTest = journey.Steps
            .Single(x => x.Type == JourneyStepType.LlTest);

        // Fail the test
        journey = await journeyService.CompleteStepAsync(
            journey.Id,
            llTest.Id,
            JourneyStepResult.Fail
        );

        Assert.Equal(
            JourneyStepStatus.Failed,
            llTest.Status
        );

        // Act — retry
        var retriedJourney = await journeyService.RetryStepAsync(
            journey.Id,
            llTest.Id
        );

        // Assert
        var retriedStep = retriedJourney.Steps
            .Single(x => x.Type == JourneyStepType.LlTest);

        Assert.Equal(
            JourneyStepStatus.Available,
            retriedStep.Status
        );

        Assert.Equal(
            JourneyStepType.LlTest,
            retriedJourney.CurrentStep
        );

        Assert.Equal(
            JourneyStatus.InProgress,
            retriedJourney.Status
        );
    }
    private class TestClock : IClock
    {
        public DateTime UtcNow { get; set; } = new(2026, 8, 23);
    }
    [Fact]
    public async Task CompleteStepAsync_WhenLlIssued_ShouldRecordIssuanceDate()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        await using var dbContext = new AppDbContext(options);

        var clock = new TestClock
        {
            UtcNow = new DateTime(2026, 8, 23)
        };

        var applicant = new Applicant
        {
            Id = Guid.NewGuid(),
            Age = 18,
            State = "Karnataka",
            City = "Bengaluru",
            IsFirstLicence = true,
            VehicleTypes =
            [
                VehicleType.MCWG
            ]
        };

        dbContext.Applicants.Add(applicant);
        await dbContext.SaveChangesAsync();

        var journeyService = new JourneyService(
            dbContext,
            new EligibilityService(),
            clock
        );

        var journey = await journeyService.CreateAsync(applicant.Id);

        // Move to LL Issued
        for (var i = 0; i < 5; i++)
        {
            var currentStep = journey.Steps
                .Single(x => x.Type == journey.CurrentStep);

            CompleteRequiredRequirements(currentStep);

            journey = await journeyService.CompleteStepAsync(
                journey.Id,
                currentStep.Id,
                JourneyStepResult.Pass
            );
        }

        var llIssuedStep = journey.Steps
            .Single(x => x.Type == JourneyStepType.LlIssued);

        // Act
        journey = await journeyService.CompleteStepAsync(
            journey.Id,
            llIssuedStep.Id,
            JourneyStepResult.Pass
        );

        // Assert
        Assert.Equal(
            new DateTime(2026, 8, 23),
            journey.LearnerLicenceIssuedAt
        );
    }
    [Fact]
    public async Task CompleteStepAsync_WhenLlIssued_ShouldKeepWaitingPeriodLockedBefore30Days()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        await using var dbContext = new AppDbContext(options);

        var clock = new TestClock
        {
            UtcNow = new DateTime(2026, 8, 23)
        };

        var applicant = new Applicant
        {
            Id = Guid.NewGuid(),
            Age = 18,
            State = "Karnataka",
            City = "Bengaluru",
            IsFirstLicence = true,
            VehicleTypes =
            [
                VehicleType.MCWG
            ]
        };

        dbContext.Applicants.Add(applicant);
        await dbContext.SaveChangesAsync();

        var journeyService = new JourneyService(
            dbContext,
            new EligibilityService(),
            clock
        );

        var journey = await journeyService.CreateAsync(applicant.Id);

        // Move through LL test
        for (var i = 0; i < 5; i++)
        {
            var currentStep = journey.Steps
                .Single(x => x.Type == journey.CurrentStep);
            CompleteRequiredRequirements(currentStep);

            journey = await journeyService.CompleteStepAsync(
                journey.Id,
                currentStep.Id,
                JourneyStepResult.Pass
            );
        }

        // Complete LL Issued
        var llIssuedStep = journey.Steps
            .Single(x => x.Type == JourneyStepType.LlIssued);

        journey = await journeyService.CompleteStepAsync(
            journey.Id,
            llIssuedStep.Id,
            JourneyStepResult.Pass
        );

        // Move clock forward by 29 days
        clock.UtcNow = new DateTime(2026, 9, 21);

        // Act
        var waitingPeriod = journey.Steps
            .Single(x => x.Type == JourneyStepType.WaitingPeriod);

        var dlApplication = journey.Steps
            .Single(x => x.Type == JourneyStepType.DlApplication);

        // Assert
        Assert.Equal(
            JourneyStepStatus.Available,
            waitingPeriod.Status
        );

        Assert.Equal(
            JourneyStepStatus.Locked,
            dlApplication.Status
        );
    }
    [Fact]
    public async Task EvaluateWaitingPeriod_When30DaysHavePassed_ShouldUnlockDlApplication()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        await using var dbContext = new AppDbContext(options);

        var clock = new TestClock
        {
            UtcNow = new DateTime(2026, 8, 23)
        };

        var applicant = new Applicant
        {
            Id = Guid.NewGuid(),
            Age = 18,
            State = "Karnataka",
            City = "Bengaluru",
            IsFirstLicence = true,
            VehicleTypes =
            [
                VehicleType.MCWG
            ]
        };

        dbContext.Applicants.Add(applicant);
        await dbContext.SaveChangesAsync();

        var journeyService = new JourneyService(
            dbContext,
            new EligibilityService(),
            clock
        );

        var journey = await journeyService.CreateAsync(applicant.Id);

        // Move through LL application → LL test
        for (var i = 0; i < 5; i++)
        {
            var currentStep = journey.Steps
                .Single(x => x.Type == journey.CurrentStep);

            CompleteRequiredRequirements(currentStep);

            journey = await journeyService.CompleteStepAsync(
                journey.Id,
                currentStep.Id,
                JourneyStepResult.Pass
            );
        }

        // Complete LL Issued
        var llIssuedStep = journey.Steps
            .Single(x => x.Type == JourneyStepType.LlIssued);

        journey = await journeyService.CompleteStepAsync(
            journey.Id,
            llIssuedStep.Id,
            JourneyStepResult.Pass
        );

        // Exactly 30 days later
        clock.UtcNow = new DateTime(2026, 9, 22);

        // Act
        journey = await journeyService.EvaluateWaitingPeriodAsync(
            journey.Id
        );

        var waitingPeriod = journey.Steps
            .Single(x => x.Type == JourneyStepType.WaitingPeriod);

        var dlApplication = journey.Steps
            .Single(x => x.Type == JourneyStepType.DlApplication);

        // Assert
        Assert.Equal(
            JourneyStepStatus.Completed,
            waitingPeriod.Status
        );

        Assert.Equal(
            JourneyStepStatus.Available,
            dlApplication.Status
        );

        Assert.Equal(
            JourneyStepType.DlApplication,
            journey.CurrentStep
        );
    }
    [Fact]
    public async Task CompleteJourney_HappyPath_ShouldReachDlIssued()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        await using var dbContext = new AppDbContext(options);

        var clock = new TestClock
        {
            UtcNow = new DateTime(2026, 8, 23)
        };

        var applicant = new Applicant
        {
            Id = Guid.NewGuid(),
            Age = 18,
            State = "Karnataka",
            City = "Bengaluru",
            IsFirstLicence = true,
            VehicleTypes =
            [
                VehicleType.MCWG
            ]
        };

        dbContext.Applicants.Add(applicant);
        await dbContext.SaveChangesAsync();

        var journeyService = new JourneyService(
            dbContext,
            new EligibilityService(),
            clock
        );

        var journey = await journeyService.CreateAsync(applicant.Id);

        // Complete LL Application → LL Test
        for (var i = 0; i < 4; i++)
        {
            var currentStep = journey.Steps
                .Single(x => x.Type == journey.CurrentStep);

            CompleteRequiredRequirements(currentStep);

            journey = await journeyService.CompleteStepAsync(
                journey.Id,
                currentStep.Id,
                JourneyStepResult.Pass
            );
        }

        // Complete LL Test
        var llTest = journey.Steps
            .Single(x => x.Type == JourneyStepType.LlTest);

        journey = await journeyService.CompleteStepAsync(
            journey.Id,
            llTest.Id,
            JourneyStepResult.Pass
        );

        // Complete LL Issued
        var llIssued = journey.Steps
            .Single(x => x.Type == JourneyStepType.LlIssued);

        journey = await journeyService.CompleteStepAsync(
            journey.Id,
            llIssued.Id,
            JourneyStepResult.Pass
        );

        // Advance 30 days
        clock.UtcNow = new DateTime(2026, 9, 22);

        journey = await journeyService.EvaluateWaitingPeriodAsync(
            journey.Id
        );

        // Complete DL Application → Driving Test
        for (var i = 0; i < 2; i++)
        {
            var currentStep = journey.Steps
                .Single(x => x.Type == journey.CurrentStep);

            CompleteRequiredRequirements(currentStep);

            journey = await journeyService.CompleteStepAsync(
                journey.Id,
                currentStep.Id,
                JourneyStepResult.Pass
            );
        }

        // Complete Driving Test
        var drivingTest = journey.Steps
            .Single(x => x.Type == JourneyStepType.DrivingTest);

        journey = await journeyService.CompleteStepAsync(
            journey.Id,
            drivingTest.Id,
            JourneyStepResult.Pass
        );

        // Complete DL Issued
        var dlIssued = journey.Steps
            .Single(x => x.Type == JourneyStepType.DlIssued);

        journey = await journeyService.CompleteStepAsync(
            journey.Id,
            dlIssued.Id,
            JourneyStepResult.Pass
        );

        // Assert
        Assert.Equal(
            JourneyStatus.Completed,
            journey.Status
        );

        Assert.Equal(
            JourneyStepType.DlIssued,
            journey.CurrentStep
        );

        Assert.Equal(
            JourneyStepStatus.Completed,
            dlIssued.Status
        );
    }
    [Fact]
    public async Task DrivingTest_WhenFailedAndRetried_ShouldEventuallyReachDlIssued()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        await using var dbContext = new AppDbContext(options);

        var clock = new TestClock
        {
            UtcNow = new DateTime(2026, 8, 23)
        };

        var applicant = new Applicant
        {
            Id = Guid.NewGuid(),
            Age = 18,
            State = "Karnataka",
            City = "Bengaluru",
            IsFirstLicence = true,
            VehicleTypes =
            [
                VehicleType.MCWG
            ]
        };

        dbContext.Applicants.Add(applicant);
        await dbContext.SaveChangesAsync();

        var journeyService = new JourneyService(
            dbContext,
            new EligibilityService(),
            clock
        );

        var journey = await journeyService.CreateAsync(applicant.Id);

        // Complete LL flow
        for (var i = 0; i < 6; i++)
        {
            var currentStep = journey.Steps
                .Single(x => x.Type == journey.CurrentStep);

            CompleteRequiredRequirements(currentStep);

            journey = await journeyService.CompleteStepAsync(
                journey.Id,
                currentStep.Id,
                JourneyStepResult.Pass
            );
        }

        // At this point WaitingPeriod should be current.
        clock.UtcNow = new DateTime(2026, 9, 22);

        journey = await journeyService.EvaluateWaitingPeriodAsync(
            journey.Id
        );

        // Complete DL Application and DL Payment
        for (var i = 0; i < 2; i++)
        {
            var currentStep = journey.Steps
                .Single(x => x.Type == journey.CurrentStep);

            CompleteRequiredRequirements(currentStep);

            journey = await journeyService.CompleteStepAsync(
                journey.Id,
                currentStep.Id,
                JourneyStepResult.Pass
            );
        }

        var drivingTest = journey.Steps
            .Single(x => x.Type == JourneyStepType.DrivingTest);

        // Act — fail driving test
        journey = await journeyService.CompleteStepAsync(
            journey.Id,
            drivingTest.Id,
            JourneyStepResult.Fail
        );

        // Assert failure
        Assert.Equal(
            JourneyStepStatus.Failed,
            journey.Steps
                .Single(x => x.Type == JourneyStepType.DrivingTest)
                .Status
        );

        Assert.Equal(
            JourneyStepType.DrivingTest,
            journey.CurrentStep
        );

        // Retry
        journey = await journeyService.RetryStepAsync(
            journey.Id,
            drivingTest.Id
        );

        Assert.Equal(
            JourneyStepStatus.Available,
            journey.Steps
                .Single(x => x.Type == JourneyStepType.DrivingTest)
                .Status
        );

        // Pass after retry
        journey = await journeyService.CompleteStepAsync(
            journey.Id,
            drivingTest.Id,
            JourneyStepResult.Pass
        );

        // Assert final state
        var dlIssued = journey.Steps
            .Single(x => x.Type == JourneyStepType.DlIssued);

        Assert.Equal(
            JourneyStepStatus.Available,
            dlIssued.Status
        );

        // Complete DL Issued
        journey = await journeyService.CompleteStepAsync(
            journey.Id,
            dlIssued.Id,
            JourneyStepResult.Pass
        );

        Assert.Equal(
            JourneyStepStatus.Completed,
            dlIssued.Status
        );

        Assert.Equal(
            JourneyStatus.Completed,
            journey.Status
        );
    }
    [Fact]
    public async Task CompleteStepAsync_BeforeWaitingPeriod_ShouldRejectDlApplication()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        await using var dbContext = new AppDbContext(options);

        var clock = new TestClock
        {
            UtcNow = new DateTime(2026, 8, 23)
        };

        var applicant = new Applicant
        {
            Id = Guid.NewGuid(),
            Age = 18,
            State = "Karnataka",
            City = "Bengaluru",
            IsFirstLicence = true,
            VehicleTypes =
            [
                VehicleType.MCWG
            ]
        };

        dbContext.Applicants.Add(applicant);
        await dbContext.SaveChangesAsync();

        var journeyService = new JourneyService(
            dbContext,
            new EligibilityService(),
            clock
        );

        var journey = await journeyService.CreateAsync(applicant.Id);

        // Complete LL flow
        for (var i = 0; i < 6; i++)
        {
            var currentStep = journey.Steps
                .Single(x => x.Type == journey.CurrentStep);

            CompleteRequiredRequirements(currentStep);

            journey = await journeyService.CompleteStepAsync(
                journey.Id,
                currentStep.Id,
                JourneyStepResult.Pass
            );
        }

        // At this point WaitingPeriod is current.
        var dlApplication = journey.Steps
            .Single(x => x.Type == JourneyStepType.DlApplication);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<InvalidOperationException>(
            () => journeyService.CompleteStepAsync(
                journey.Id,
                dlApplication.Id,
                JourneyStepResult.Pass
            )
        );

        Assert.Equal(
            "Only the current journey step can be completed.",
            exception.Message
        );
    }
    [Fact]
    public async Task JourneyState_ShouldPersistAcrossDbContextInstances()
    {
        var databaseName = Guid.NewGuid().ToString();

        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName)
            .Options;

        var applicantId = Guid.NewGuid();
        var journeyId = Guid.Empty;

        // First context — create and progress journey
        await using (var dbContext = new AppDbContext(options))
        {
            var applicant = new Applicant
            {
                Id = applicantId,
                Age = 18,
                State = "Karnataka",
                City = "Bengaluru",
                IsFirstLicence = true,
                VehicleTypes =
                [
                    VehicleType.MCWG
                ]
            };

            dbContext.Applicants.Add(applicant);
            await dbContext.SaveChangesAsync();

            var journeyService = new JourneyService(
                dbContext,
                new EligibilityService(),
                new TestClock()
            );

            var journey = await journeyService.CreateAsync(applicant.Id);

            var currentStep = journey.Steps
                .Single(x => x.Type == JourneyStepType.LlApplication);

            CompleteRequiredRequirements(currentStep);

            await journeyService.CompleteStepAsync(
                journey.Id,
                currentStep.Id,
                JourneyStepResult.Pass
            );

            journeyId = journey.Id;
        }

        // Second context — reload from database
        await using (var dbContext = new AppDbContext(options))
        {
            var journeyService = new JourneyService(
                dbContext,
                new EligibilityService(),
                new TestClock()
            );

            var journey = await dbContext.LicenceJourneys
                .Include(x => x.Steps)
                .FirstOrDefaultAsync(x => x.Id == journeyId);

            // Assert
            Assert.NotNull(journey);

            Assert.Equal(
                JourneyStepType.LlDocuments,
                journey.CurrentStep
            );

            Assert.Equal(
                JourneyStatus.InProgress,
                journey.Status
            );

            Assert.Equal(
                JourneyStepStatus.Completed,
                journey.Steps
                    .Single(x => x.Type == JourneyStepType.LlApplication)
                    .Status
            );

            Assert.Equal(
                JourneyStepStatus.Available,
                journey.Steps
                    .Single(x => x.Type == JourneyStepType.LlDocuments)
                    .Status
            );
        }
    }
    [Fact]
    public async Task CreateAsync_ShouldGenerateRequirementsForDocumentSteps()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        await using var dbContext = new AppDbContext(options);

        var applicant = new Applicant
        {
            Id = Guid.NewGuid(),
            Age = 18,
            State = "Karnataka",
            City = "Bengaluru",
            IsFirstLicence = true,
            VehicleTypes =
            [
                VehicleType.MCWG
            ]
        };

        dbContext.Applicants.Add(applicant);
        await dbContext.SaveChangesAsync();

        var journeyService = new JourneyService(
            dbContext,
            new EligibilityService(),
            new TestClock()
        );

        // Act
        var journey = await journeyService.CreateAsync(applicant.Id);

        var documentsStep = journey.Steps
            .Single(x => x.Type == JourneyStepType.LlDocuments);

        // Assert
        Assert.Equal(2, documentsStep.Requirements.Count);

        Assert.Contains(
            documentsStep.Requirements,
            x => x.Type == RequirementType.IdentityProof &&
                 x.Required &&
                 x.Status == RequirementStatus.Pending
        );

        Assert.Contains(
            documentsStep.Requirements,
            x => x.Type == RequirementType.AddressProof &&
                 x.Required &&
                 x.Status == RequirementStatus.Pending
        );

    }
    [Fact]
    public async Task CompleteStepAsync_WhenRequiredRequirementsArePending_ShouldRejectStep()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        await using var dbContext = new AppDbContext(options);

        var applicant = new Applicant
        {
            Id = Guid.NewGuid(),
            Age = 18,
            State = "Karnataka",
            City = "Bengaluru",
            IsFirstLicence = true,
            VehicleTypes =
            [
                VehicleType.MCWG
            ]
        };

        dbContext.Applicants.Add(applicant);
        await dbContext.SaveChangesAsync();

        var journeyService = new JourneyService(
            dbContext,
            new EligibilityService(),
            new TestClock()
        );

        var journey = await journeyService.CreateAsync(applicant.Id);

        var documentsStep = journey.Steps
            .Single(x => x.Type == JourneyStepType.LlDocuments);

        // Move LlApplication to completed
        var applicationStep = journey.Steps
            .Single(x => x.Type == JourneyStepType.LlApplication);

        journey = await journeyService.CompleteStepAsync(
            journey.Id,
            applicationStep.Id,
            JourneyStepResult.Pass
        );

        // Act
        var exception = await Assert.ThrowsAsync<InvalidOperationException>(
            () => journeyService.CompleteStepAsync(
                journey.Id,
                documentsStep.Id,
                JourneyStepResult.Pass
            )
        );

        // Assert
        Assert.Equal(
            "Required journey step requirements are incomplete.",
            exception.Message
        );
    }
    private static void CompleteRequiredRequirements(JourneyStep step)
    {
        foreach (var requirement in step.Requirements
            .Where(x => x.Required))
        {
            requirement.Status = RequirementStatus.Completed;
        }
    }

    [Fact]
    public async Task CompleteRequirementAsync_ShouldMarkRequirementAsCompleted()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        await using var dbContext = new AppDbContext(options);

        var applicant = new Applicant
        {
            Id = Guid.NewGuid(),
            Age = 18,
            State = "Karnataka",
            City = "Bengaluru",
            IsFirstLicence = true,
            VehicleTypes =
            [
                VehicleType.MCWG
            ]
        };

        dbContext.Applicants.Add(applicant);
        await dbContext.SaveChangesAsync();

        var journeyService = new JourneyService(
            dbContext,
            new EligibilityService(),
            new TestClock()
        );

        var journey = await journeyService.CreateAsync(applicant.Id);

        var documentsStep = journey.Steps
            .Single(x => x.Type == JourneyStepType.LlDocuments);

        var requirement = documentsStep.Requirements
            .Single(x => x.Type == RequirementType.IdentityProof);

        var applicationStep = journey.Steps
    .Single(x => x.Type == JourneyStepType.LlApplication);

        journey = await journeyService.CompleteStepAsync(
            journey.Id,
            applicationStep.Id,
            JourneyStepResult.Pass
        );

        // Act
        journey = await journeyService.CompleteRequirementAsync(
            journey.Id,
            documentsStep.Id,
            requirement.Id
        );

        // Assert
        var updatedRequirement = journey.Steps
            .Single(x => x.Type == JourneyStepType.LlDocuments)
            .Requirements
            .Single(x => x.Id == requirement.Id);

        Assert.Equal(
            RequirementStatus.Completed,
            updatedRequirement.Status
        );
    }

    [Fact]
    public async Task CompleteRequirementAsync_WhenStepIsNotCurrent_ShouldReject()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        await using var dbContext = new AppDbContext(options);

        var applicant = new Applicant
        {
            Id = Guid.NewGuid(),
            Age = 18,
            State = "Karnataka",
            City = "Bengaluru",
            IsFirstLicence = true,
            VehicleTypes =
            [
                VehicleType.MCWG
            ]
        };

        dbContext.Applicants.Add(applicant);
        await dbContext.SaveChangesAsync();

        var journeyService = new JourneyService(
            dbContext,
            new EligibilityService(),
            new TestClock()
        );

        var journey = await journeyService.CreateAsync(applicant.Id);

        var documentsStep = journey.Steps
            .Single(x => x.Type == JourneyStepType.LlDocuments);

        var requirement = documentsStep.Requirements
            .Single(x => x.Type == RequirementType.IdentityProof);

        // Act
        var exception = await Assert.ThrowsAsync<InvalidOperationException>(
            () => journeyService.CompleteRequirementAsync(
                journey.Id,
                documentsStep.Id,
                requirement.Id
            )
        );

        // Assert
        Assert.Equal(
            "Only requirements for the current journey step can be completed.",
            exception.Message
        );
    }
}