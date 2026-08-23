using backend.Domain.Enums;

namespace backend.Application.Rules;

public class EligibilityResult
{
    public bool IsEligible { get; set; }

    public Dictionary<VehicleType, VehicleEligibilityResult> VehicleResults { get; set; } = [];

    public List<RuleFailure> Failures { get; set; } = [];
}

public class VehicleEligibilityResult
{
    public bool IsEligible { get; set; }

    public List<RuleFailure> Failures { get; set; } = [];
}

public class RuleFailure
{
    public string Rule { get; set; } = string.Empty;

    public string Category { get; set; } = string.Empty;

    public string Message { get; set; } = string.Empty;
}