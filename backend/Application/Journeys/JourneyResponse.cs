using backend.Domain.Enums;

namespace backend.Application.Journeys;

public class JourneyResponse
{
    public Guid Id { get; set; }

    public Guid ApplicantId { get; set; }
    public string ReferenceNumber { get; set; } = string.Empty;

    public JourneyType JourneyType { get; set; }

    public JourneyStatus Status { get; set; }

    public JourneyStepType CurrentStep { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
    public DateTime? LearnerLicenceIssuedAt { get; set; }

    public List<JourneyStepResponse> Steps { get; set; } = [];
}

public class JourneyStepResponse
{
    public Guid Id { get; set; }

    public JourneyStepType Type { get; set; }

    public JourneyStepStatus Status { get; set; }

    public int Order { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public List<RequirementResponse> Requirements { get; set; } = [];
}

public class RequirementResponse
{
    public Guid Id { get; set; }

    public RequirementType Type { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public bool Required { get; set; }

    public RequirementStatus Status { get; set; }
}