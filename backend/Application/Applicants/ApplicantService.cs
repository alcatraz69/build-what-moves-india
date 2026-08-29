using backend.Application.Rules;
using backend.Domain.Entities;
using backend.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.Application.Applicants;

public class ApplicantService
{
    private readonly AppDbContext _dbContext;
    private readonly IEligibilityService _eligibilityService;

    public ApplicantService(
        AppDbContext dbContext,
        IEligibilityService eligibilityService)
    {
        _dbContext = dbContext;
        _eligibilityService = eligibilityService;
    }

    public async Task<ApplicantResponse> CreateAsync(
        CreateApplicantRequest request)
    {
        var applicant = new Applicant
        {
            Id = Guid.NewGuid(),
            Age = request.Age,
            State = request.State,
            City = request.City,
            IsFirstLicence = request.IsFirstLicence,
            VehicleTypes = request.VehicleTypes
        };

        var eligibilityResult = _eligibilityService.Evaluate(applicant);

        _dbContext.Applicants.Add(applicant);

        await _dbContext.SaveChangesAsync();

        return new ApplicantResponse
        {
            Id = applicant.Id,
            Age = applicant.Age,
            State = applicant.State,
            City = applicant.City,
            IsFirstLicence = applicant.IsFirstLicence,
            ReferenceNumber = GetReferenceNumber(applicant.Id),
            VehicleTypes = applicant.VehicleTypes,
            IsEligible = eligibilityResult.IsEligible,
            Failures = eligibilityResult.Failures
                .Select(failure => new RuleFailureResponse
                {
                    Rule = failure.Rule,
                    Category = failure.Category,
                    Message = failure.Message
                })
                .ToList()
        };
    }
    public async Task<ApplicantResponse?> GetByIdAsync(Guid id)
    {
        var applicant = await _dbContext.Applicants
            .FirstOrDefaultAsync(x => x.Id == id);

        if (applicant is null)
        {
            return null;
        }

        var eligibilityResult = _eligibilityService.Evaluate(applicant);

        return new ApplicantResponse
        {
            Id = applicant.Id,
            Age = applicant.Age,
            State = applicant.State,
            City = applicant.City,
            IsFirstLicence = applicant.IsFirstLicence,
            VehicleTypes = applicant.VehicleTypes,
            IsEligible = eligibilityResult.IsEligible,
            ReferenceNumber = GetReferenceNumber(applicant.Id),
            Failures = eligibilityResult.Failures
                .Select(failure => new RuleFailureResponse
                {
                    Rule = failure.Rule,
                    Category = failure.Category,
                    Message = failure.Message
                })
                .ToList()
        };
    }

    private static string GetReferenceNumber(Guid id)
    {
        return $"SAR-{id.ToString("N")[..6].ToUpperInvariant()}";
    }
}