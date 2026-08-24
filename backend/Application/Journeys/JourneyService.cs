using backend.Application.Rules;
using backend.Domain.Entities;
using backend.Domain.Enums;
using backend.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using backend.Application.Time;

namespace backend.Application.Journeys;

public class JourneyService : IJourneyService
{
    private readonly AppDbContext _dbContext;
    private readonly IEligibilityService _eligibilityService;
    private readonly IClock _clock;

    public JourneyService(
        AppDbContext dbContext,
        IEligibilityService eligibilityService,
        IClock clock)
    {
        _dbContext = dbContext;
        _eligibilityService = eligibilityService;
        _clock = clock;
    }

    public async Task<LicenceJourney> CreateAsync(Guid applicantId)
    {
        var applicant = await _dbContext.Applicants
            .FirstOrDefaultAsync(x => x.Id == applicantId);

        if (applicant is null)
        {
            throw new InvalidOperationException(
                "Applicant not found.");
        }

        var eligibilityResult = _eligibilityService.Evaluate(applicant);

        if (!eligibilityResult.IsEligible)
        {
            throw new InvalidOperationException(
                "Applicant is not eligible to start a licence journey.");
        }

        var existingJourney = await _dbContext.LicenceJourneys
            .FirstOrDefaultAsync(x => x.ApplicantId == applicantId);

        if (existingJourney is not null)
        {
            return existingJourney;
        }

        var journey = new LicenceJourney
        {
            Id = Guid.NewGuid(),
            ApplicantId = applicantId,
            JourneyType = JourneyType.FirstDrivingLicence,
            Status = JourneyStatus.NotStarted,
            CurrentStep = JourneyStepType.LlApplication,
            CreatedAt = _clock.UtcNow,
            UpdatedAt = _clock.UtcNow,
            Steps = CreateJourneySteps()
        };

        _dbContext.LicenceJourneys.Add(journey);

        await _dbContext.SaveChangesAsync();

        return journey;
    }

    public async Task<LicenceJourney?> GetByApplicantIdAsync(Guid applicantId)
    {
        return await _dbContext.LicenceJourneys
            .Include(x => x.Steps)
                .ThenInclude(x => x.Requirements)
            .FirstOrDefaultAsync(x => x.ApplicantId == applicantId);
    }

    private static List<JourneyStep> CreateJourneySteps()
    {
        var stepDefinitions = new[]
        {
            (JourneyStepType.LlApplication, "Apply for Learner's Licence", "Start your Learner's Licence application."),
            (JourneyStepType.LlDocuments, "Submit Documents", "Provide the required identity, address and age documents."),
            (JourneyStepType.LlAuthentication, "Complete Authentication", "Complete the required identity verification."),
            (JourneyStepType.LlPayment, "Pay Learner's Licence Fee", "Complete the Learner's Licence payment."),
            (JourneyStepType.LlTest, "Take Learner's Licence Test", "Complete the road safety and learner knowledge test."),
            (JourneyStepType.LlIssued, "Learner's Licence Issued", "Your Learner's Licence has been issued."),
            (JourneyStepType.WaitingPeriod, "Complete 30-Day Waiting Period", "You must hold your Learner's Licence for at least 30 days before applying for the Driving Licence."),
            (JourneyStepType.DlApplication, "Apply for Driving Licence", "Start your Driving Licence application."),
            (JourneyStepType.DlPayment, "Pay Driving Licence Fee", "Complete the Driving Licence payment."),
            (JourneyStepType.DrivingTest, "Take Driving Test", "Demonstrate your ability to drive the applicable vehicle class."),
            (JourneyStepType.DlIssued, "Driving Licence Issued", "Your Driving Licence has been issued.")
        };

        return stepDefinitions
            .Select((definition, index) => new JourneyStep
            {
                Id = Guid.NewGuid(),
                Type = definition.Item1,
                Status = index == 0
                    ? JourneyStepStatus.Available
                    : JourneyStepStatus.Locked,
                Order = index + 1,
                Title = definition.Item2,
                Description = definition.Item3
            })
            .ToList();
    }

    private static JourneyResponse MapToResponse(LicenceJourney journey)
    {
        return new JourneyResponse
        {
            Id = journey.Id,
            ApplicantId = journey.ApplicantId,
            JourneyType = journey.JourneyType,
            Status = journey.Status,
            CurrentStep = journey.CurrentStep,
            CreatedAt = journey.CreatedAt,
            UpdatedAt = journey.UpdatedAt,

            Steps = journey.Steps
                .OrderBy(step => step.Order)
                .Select(step => new JourneyStepResponse
                {
                    Id = step.Id,
                    Type = step.Type,
                    Status = step.Status,
                    Order = step.Order,
                    Title = step.Title,
                    Description = step.Description,

                    Requirements = step.Requirements
                        .Select(requirement => new RequirementResponse
                        {
                            Id = requirement.Id,
                            Type = requirement.Type,
                            Title = requirement.Title,
                            Description = requirement.Description,
                            Required = requirement.Required,
                            Status = requirement.Status
                        })
                        .ToList()
                })
                .ToList()
        };
    }
    public async Task<LicenceJourney> CompleteStepAsync(
        Guid journeyId,
        Guid stepId,
        JourneyStepResult result)
    {
        var journey = await _dbContext.LicenceJourneys
            .Include(x => x.Steps)
                .ThenInclude(x => x.Requirements)
            .FirstOrDefaultAsync(x => x.Id == journeyId);

        if (journey is null)
        {
            throw new InvalidOperationException(
                "Journey not found.");
        }

        var currentStep = journey.Steps
            .FirstOrDefault(x => x.Type == journey.CurrentStep);

        if (currentStep is null)
        {
            throw new InvalidOperationException(
                "Current journey step not found.");
        }

        if (currentStep.Id != stepId)
        {
            throw new InvalidOperationException(
                "Only the current journey step can be completed.");
        }

        if (currentStep.Status != JourneyStepStatus.Available &&
            currentStep.Status != JourneyStepStatus.InProgress)
        {
            throw new InvalidOperationException(
                "The current journey step cannot be completed.");
        }

        if (result == JourneyStepResult.Fail)
        {
            currentStep.Status = JourneyStepStatus.Failed;

            journey.UpdatedAt = _clock.UtcNow;

            await _dbContext.SaveChangesAsync();

            return journey;
        }

        currentStep.Status = JourneyStepStatus.Completed;
        if (currentStep.Type == JourneyStepType.LlIssued)
        {
            journey.LearnerLicenceIssuedAt = _clock.UtcNow;
        }
        var nextStep = journey.Steps
            .Where(x => x.Order > currentStep.Order)
            .OrderBy(x => x.Order)
            .FirstOrDefault();

        if (nextStep is null)
        {
            journey.Status = JourneyStatus.Completed;
        }
        else
        {
            nextStep.Status = JourneyStepStatus.Available;
            journey.CurrentStep = nextStep.Type;
            journey.Status = JourneyStatus.InProgress;
        }

        journey.UpdatedAt = _clock.UtcNow;

        await _dbContext.SaveChangesAsync();

        return journey;
    }
    public async Task<LicenceJourney> RetryStepAsync(
        Guid journeyId,
        Guid stepId)
    {
        var journey = await _dbContext.LicenceJourneys
            .Include(x => x.Steps)
                .ThenInclude(x => x.Requirements)
            .FirstOrDefaultAsync(x => x.Id == journeyId);

        if (journey is null)
        {
            throw new InvalidOperationException(
                "Journey not found.");
        }

        var step = journey.Steps
            .FirstOrDefault(x => x.Id == stepId);

        if (step is null)
        {
            throw new InvalidOperationException(
                "Journey step not found.");
        }

        if (step.Status != JourneyStepStatus.Failed)
        {
            throw new InvalidOperationException(
                "Only a failed step can be retried.");
        }

        if (step.Type != journey.CurrentStep)
        {
            throw new InvalidOperationException(
                "Only the current journey step can be retried.");
        }

        step.Status = JourneyStepStatus.Available;

        journey.Status = JourneyStatus.InProgress;
        journey.UpdatedAt = _clock.UtcNow;

        await _dbContext.SaveChangesAsync();

        return journey;
    }
    public async Task<LicenceJourney> EvaluateWaitingPeriodAsync(Guid journeyId)
{
    var journey = await _dbContext.LicenceJourneys
        .Include(x => x.Steps)
            .ThenInclude(x => x.Requirements)
        .FirstOrDefaultAsync(x => x.Id == journeyId);

    if (journey is null)
    {
        throw new InvalidOperationException("Journey not found.");
    }

    if (journey.LearnerLicenceIssuedAt is null)
    {
        return journey;
    }

    var waitingPeriod = journey.Steps
        .Single(x => x.Type == JourneyStepType.WaitingPeriod);

    var dlApplication = journey.Steps
        .Single(x => x.Type == JourneyStepType.DlApplication);

    var eligibleDate = journey.LearnerLicenceIssuedAt.Value.AddDays(30);

    if (_clock.UtcNow >= eligibleDate &&
        waitingPeriod.Status == JourneyStepStatus.Available)
    {
        waitingPeriod.Status = JourneyStepStatus.Completed;
        dlApplication.Status = JourneyStepStatus.Available;

        journey.CurrentStep = JourneyStepType.DlApplication;
        journey.Status = JourneyStatus.InProgress;
        journey.UpdatedAt = _clock.UtcNow;

        await _dbContext.SaveChangesAsync();
    }

    return journey;
}
}