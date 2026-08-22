using backend.Domain.Enums;

namespace backend.Domain.Entities;

public class JourneyStep
{
    public Guid Id { get; set; }

    public Guid JourneyId { get; set; }

    public JourneyStepType Type { get; set; }

    public JourneyStepStatus Status { get; set; }

    public int Order { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public LicenceJourney Journey { get; set; } = null!;

    public List<Requirement> Requirements { get; set; } = [];
}