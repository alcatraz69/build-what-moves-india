using backend.Domain.Enums;

namespace backend.Domain.Entities;

public class LicenceJourney
{
    public Guid Id { get; set; }

    public Guid ApplicantId { get; set; }

    public JourneyType JourneyType { get; set; }

    public JourneyStatus Status { get; set; }

    public JourneyStepType CurrentStep { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
    public DateTime? LearnerLicenceIssuedAt { get; set; }

    public Applicant Applicant { get; set; } = null!;

    public List<JourneyStep> Steps { get; set; } = [];
}