using backend.Domain.Enums;

namespace backend.Application.Applicants;

public class ApplicantResponse
{
    public Guid Id { get; set; }

    public string ReferenceNumber { get; set; } = string.Empty;

    public int Age { get; set; }

    public string State { get; set; } = string.Empty;

    public string City { get; set; } = string.Empty;

    public bool IsFirstLicence { get; set; }

    public List<VehicleType> VehicleTypes { get; set; } = [];

    public bool IsEligible { get; set; }

    public List<RuleFailureResponse> Failures { get; set; } = [];
}

public class RuleFailureResponse
{
    public string Rule { get; set; } = string.Empty;

    public string Category { get; set; } = string.Empty;

    public string Message { get; set; } = string.Empty;
}