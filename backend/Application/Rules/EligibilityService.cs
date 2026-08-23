using backend.Domain.Entities;
using backend.Domain.Enums;

namespace backend.Application.Rules;

public class EligibilityService : IEligibilityService
{
    private const int MinimumAge = 18;
    private const string SupportedState = "Karnataka";

  public EligibilityResult Evaluate(Applicant applicant)
{
    var result = new EligibilityResult();

    foreach (var vehicleType in applicant.VehicleTypes.Distinct())
    {
        EvaluateVehicleEligibility(
            applicant,
            vehicleType,
            result
        );
    }

    EvaluateApplicantEligibility(applicant, result);

    result.IsEligible = result.Failures.Count == 0 &&
                        result.VehicleResults.Values.All(x => x.IsEligible);

    return result;
}

    private static void EvaluateVehicleEligibility(
        Applicant applicant,
        VehicleType vehicleType,
        EligibilityResult result)
    {
        var vehicleResult = new VehicleEligibilityResult();

        if (applicant.Age < MinimumAge)
        {
            vehicleResult.Failures.Add(new RuleFailure
            {
                Rule = $"{vehicleType}_MINIMUM_AGE",
                Category = "ELIGIBILITY",
                Message = $"Applicant must be at least {MinimumAge} years old for {vehicleType}."
            });
        }

        vehicleResult.IsEligible = vehicleResult.Failures.Count == 0;

        result.VehicleResults[vehicleType] = vehicleResult;

        result.Failures.AddRange(vehicleResult.Failures);
    }

    private static void EvaluateApplicantEligibility(
        Applicant applicant,
        EligibilityResult result)
    {
        if (!string.Equals(
                applicant.State,
                SupportedState,
                StringComparison.OrdinalIgnoreCase))
        {
            result.Failures.Add(new RuleFailure
            {
                Rule = "UNSUPPORTED_STATE",
                Category = "ELIGIBILITY",
                Message = "This MVP currently supports applications from Karnataka."
            });
        }

        if (!applicant.IsFirstLicence)
        {
            result.Failures.Add(new RuleFailure
            {
                Rule = "FIRST_LICENCE_ONLY",
                Category = "ELIGIBILITY",
                Message = "This journey is currently designed for first-time driving licence applicants."
            });
        }
    }
}