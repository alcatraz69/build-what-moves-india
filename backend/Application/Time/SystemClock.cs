namespace backend.Application.Time;

public class SystemClock : IClock
{
    public DateTime UtcNow => DateTime.UtcNow;
}