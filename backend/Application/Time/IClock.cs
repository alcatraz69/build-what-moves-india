namespace backend.Application.Time;

public interface IClock
{
    DateTime UtcNow { get; }
}