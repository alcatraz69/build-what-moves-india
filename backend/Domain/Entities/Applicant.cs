using backend.Domain.Enums;

namespace backend.Domain.Entities;

public class Applicant
{
    public Guid Id { get; set; }

    public int Age { get; set; }

    public string State { get; set; } = string.Empty;

    public string City { get; set; } = string.Empty;

    public bool IsFirstLicence { get; set; }

    public List<VehicleType> VehicleTypes { get; set; } = [];

    public LicenceJourney? LicenceJourney { get; set; }

    public List<Licence> Licences { get; set; } = [];
}