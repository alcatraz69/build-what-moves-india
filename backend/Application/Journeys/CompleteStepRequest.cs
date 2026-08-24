using backend.Domain.Enums;

namespace backend.Application.Journeys;

public class CompleteStepRequest
{
    public JourneyStepResult Result { get; set; }
}