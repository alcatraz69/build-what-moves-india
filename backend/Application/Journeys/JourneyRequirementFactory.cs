using backend.Domain.Entities;
using backend.Domain.Enums;

namespace backend.Application.Journeys;

public static class JourneyRequirementFactory
{
    public static List<Requirement> CreateFor(JourneyStepType stepType)
    {
        return stepType switch
        {
            JourneyStepType.LlDocuments =>
            [
                new Requirement
                {
                    Id = Guid.NewGuid(),
                    Type = RequirementType.IdentityProof,
                    Title = "Identity Proof",
                    Description = "Provide a valid identity document. This document is also used to verify your age.",
                    Required = true,
                    Status = RequirementStatus.Pending
                },
                new Requirement
                {
                    Id = Guid.NewGuid(),
                    Type = RequirementType.AddressProof,
                    Title = "Address Proof",
                    Description = "Provide a valid address proof.",
                    Required = true,
                    Status = RequirementStatus.Pending
                },
            ],

            JourneyStepType.LlAuthentication =>
            [
                new Requirement
                {
                    Id = Guid.NewGuid(),
                    Type = RequirementType.Declaration,
                    Title = "Applicant Declaration",
                    Description = "Confirm the applicant declaration.",
                    Required = true,
                    Status = RequirementStatus.Pending
                }
            ],

            _ => []
        };
    }
}