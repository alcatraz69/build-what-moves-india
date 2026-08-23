using backend.Domain.Entities;

namespace backend.Application.Rules;

public interface IEligibilityService
{
    EligibilityResult Evaluate(Applicant applicant);
}