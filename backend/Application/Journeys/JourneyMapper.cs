using backend.Domain.Entities;

namespace backend.Application.Journeys;

public static class JourneyMapper
{
    public static JourneyResponse ToResponse(LicenceJourney journey)
    {
        return new JourneyResponse
        {
            Id = journey.Id,
            ApplicantId = journey.ApplicantId,
            ReferenceNumber = $"SAR-{journey.ApplicantId.ToString("N")[..6].ToUpperInvariant()}",
            JourneyType = journey.JourneyType,
            Status = journey.Status,
            CurrentStep = journey.CurrentStep,
            CreatedAt = journey.CreatedAt,
            UpdatedAt = journey.UpdatedAt,
            LearnerLicenceIssuedAt = journey.LearnerLicenceIssuedAt,

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
}