namespace backend.Application.Assistant;

public interface IJourneyAssistantService
{
    Task<JourneyAssistantResponse?> AskAsync(
        Guid applicantId,
        JourneyAssistantRequest request,
        CancellationToken cancellationToken);
}
