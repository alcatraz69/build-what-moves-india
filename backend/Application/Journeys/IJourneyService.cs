using backend.Domain.Entities;
using backend.Domain.Enums;
namespace backend.Application.Journeys;

public interface IJourneyService
{
    Task<LicenceJourney> CreateAsync(Guid applicantId);

    Task<LicenceJourney?> GetByApplicantIdAsync(Guid applicantId);

    Task<LicenceJourney> CompleteStepAsync(
        Guid journeyId,
        Guid stepId,
         JourneyStepResult result);

    Task<LicenceJourney> RetryStepAsync(
       Guid journeyId,
       Guid stepId);

    Task<LicenceJourney> EvaluateWaitingPeriodAsync(Guid journeyId);
}