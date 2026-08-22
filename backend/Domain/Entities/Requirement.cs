using backend.Domain.Enums;

namespace backend.Domain.Entities;

public class Requirement
{
    public Guid Id { get; set; }

    public Guid JourneyStepId { get; set; }

    public RequirementType Type { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public bool Required { get; set; }

    public RequirementStatus Status { get; set; }

    public JourneyStep JourneyStep { get; set; } = null!;
}