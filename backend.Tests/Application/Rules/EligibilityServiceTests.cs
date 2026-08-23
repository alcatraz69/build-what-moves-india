using backend.Application.Rules;
using backend.Domain.Entities;
using backend.Domain.Enums;

namespace backend.Tests.Application.Rules;

public class EligibilityServiceTests
{
    [Fact]
    public void Evaluate_WhenApplicantIs18InKarnatakaAndRequestsMcwgAndLmv_ShouldBeEligible()
    {
        // Arrange
        var applicant = new Applicant
        {
            Id = Guid.NewGuid(),
            Age = 18,
            State = "Karnataka",
            City = "Bengaluru",
            IsFirstLicence = true,
            VehicleTypes =
            [
                VehicleType.MCWG,
                VehicleType.LMV
            ]
        };

        var service = new EligibilityService();

        // Act
        var result = service.Evaluate(applicant);

        // Assert
        Assert.True(result.IsEligible);
        Assert.True(result.VehicleResults[VehicleType.MCWG].IsEligible);
        Assert.True(result.VehicleResults[VehicleType.LMV].IsEligible);
        Assert.Empty(result.Failures);
    }
    [Fact]
    public void Evaluate_WhenApplicantIs17AndRequestsLmv_ShouldNotBeEligible()
    {
        // Arrange
        var applicant = new Applicant
        {
            Id = Guid.NewGuid(),
            Age = 17,
            State = "Karnataka",
            City = "Bengaluru",
            IsFirstLicence = true,
            VehicleTypes =
            [
                VehicleType.LMV
            ]
        };

        var service = new EligibilityService();

        // Act
        var result = service.Evaluate(applicant);

        // Assert
        Assert.False(result.IsEligible);
        Assert.False(result.VehicleResults[VehicleType.LMV].IsEligible);
        Assert.Contains(
            result.Failures,
            failure => failure.Rule == "LMV_MINIMUM_AGE"
        );
    }
    [Fact]
    public void Evaluate_WhenApplicantIsFromUnsupportedState_ShouldNotBeEligible()
    {
        // Arrange
        var applicant = new Applicant
        {
            Id = Guid.NewGuid(),
            Age = 18,
            State = "Maharashtra",
            City = "Mumbai",
            IsFirstLicence = true,
            VehicleTypes =
            [
                VehicleType.MCWG
            ]
        };

        var service = new EligibilityService();

        // Act
        var result = service.Evaluate(applicant);

        // Assert
        Assert.False(result.IsEligible);
        Assert.Contains(
            result.Failures,
            failure => failure.Rule == "UNSUPPORTED_STATE"
        );
    }
    [Fact]
public void Evaluate_WhenApplicantAlreadyHasLicence_ShouldNotBeEligible()
{
    // Arrange
    var applicant = new Applicant
    {
        Id = Guid.NewGuid(),
        Age = 18,
        State = "Karnataka",
        City = "Bengaluru",
        IsFirstLicence = false,
        VehicleTypes =
        [
            VehicleType.MCWG
        ]
    };

    var service = new EligibilityService();

    // Act
    var result = service.Evaluate(applicant);

    // Assert
    Assert.False(result.IsEligible);
    Assert.Contains(
        result.Failures,
        failure => failure.Rule == "FIRST_LICENCE_ONLY"
    );
}
[Fact]
public void Evaluate_WhenApplicantRequestsOnlyMcwg_ShouldNotEvaluateLmv()
{
    // Arrange
    var applicant = new Applicant
    {
        Id = Guid.NewGuid(),
        Age = 18,
        State = "Karnataka",
        City = "Bengaluru",
        IsFirstLicence = true,
        VehicleTypes =
        [
            VehicleType.MCWG
        ]
    };

    var service = new EligibilityService();

    // Act
    var result = service.Evaluate(applicant);

    // Assert
    Assert.True(result.IsEligible);
    Assert.True(result.VehicleResults.ContainsKey(VehicleType.MCWG));
    Assert.False(result.VehicleResults.ContainsKey(VehicleType.LMV));
}
}

