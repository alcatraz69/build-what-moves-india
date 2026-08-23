using backend.Domain.Enums;

namespace backend.Application.Applicants;

public class CreateApplicantRequest
{
    public int Age { get; set; }

    public string State { get; set; } = string.Empty;

    public string City { get; set; } = string.Empty;

    public bool IsFirstLicence { get; set; }

    public List<VehicleType> VehicleTypes { get; set; } = [];
}