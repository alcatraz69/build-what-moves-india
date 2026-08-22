using backend.Domain.Enums;

namespace backend.Domain.Entities;

public class Licence
{
    public Guid Id { get; set; }

    public Guid ApplicantId { get; set; }

    public LicenceType Type { get; set; }

    public LicenceStatus Status { get; set; }

    public DateTime IssuedAt { get; set; }

    public List<VehicleType> VehicleTypes { get; set; } = [];

    public Applicant Applicant { get; set; } = null!;
}