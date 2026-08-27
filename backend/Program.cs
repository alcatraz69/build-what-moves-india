using backend.Application.Applicants;
using backend.Application.Rules;
using backend.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
using backend.Application.Journeys;
using backend.Application.Time;
using backend.Application.Assistant;

var builder = WebApplication.CreateBuilder(args);

builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.Converters.Add(
        new JsonStringEnumConverter()
    );
});

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(
        builder.Configuration.GetConnectionString("DefaultConnection")
    ));

builder.Services.AddScoped<IEligibilityService, EligibilityService>();
builder.Services.AddScoped<ApplicantService>();

var frontendOrigin =
    builder.Configuration["FrontendOrigin"]
    ?? "http://localhost:5173";

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy
            .WithOrigins(frontendOrigin)
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddScoped<IJourneyService, JourneyService>();
builder.Services.AddSingleton<IClock, SystemClock>();
builder.Services.AddHttpClient<IJourneyAssistantService, JourneyAssistantService>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

app.MapPost("/api/applicants", async (
    CreateApplicantRequest request,
    ApplicantService applicantService) =>
{
    var result = await applicantService.CreateAsync(request);

    return Results.Ok(result);
});

app.MapGet("/api/applicants/{id:guid}", async (
    Guid id,
    ApplicantService applicantService) =>
{
    var result = await applicantService.GetByIdAsync(id);

    return result is null
        ? Results.NotFound()
        : Results.Ok(result);
});

app.MapPost("/api/applicants/{applicantId:guid}/journey", async (
    Guid applicantId,
    IJourneyService journeyService) =>
{
    try
    {
        var journey = await journeyService.CreateAsync(applicantId);

        return Results.Ok(JourneyMapper.ToResponse(journey));
    }
    catch (InvalidOperationException ex)
    {
        return Results.BadRequest(new
        {
            message = ex.Message
        });
    }
});

app.MapGet("/api/applicants/{applicantId:guid}/journey", async (
    Guid applicantId,
    IJourneyService journeyService) =>
{
    var journey = await journeyService.GetByApplicantIdAsync(applicantId);

    return journey is null
        ? Results.NotFound()
        : Results.Ok(JourneyMapper.ToResponse(journey));
});

app.MapPost("/api/applicants/{applicantId:guid}/journey/assistant", async (
    Guid applicantId,
    JourneyAssistantRequest request,
    IJourneyAssistantService assistantService,
    CancellationToken cancellationToken) =>
{
    try
    {
        var result = await assistantService.AskAsync(
            applicantId,
            request,
            cancellationToken);

        return result is null
            ? Results.NotFound()
            : Results.Ok(result);
    }
    catch (InvalidOperationException ex)
    {
        return Results.BadRequest(new
        {
            message = ex.Message
        });
    }
    catch (JourneyAssistantConfigurationException)
    {
        return Results.Problem(
            title: "Assistant configuration error",
            detail: "The journey assistant is not configured.",
            statusCode: StatusCodes.Status500InternalServerError);
    }
    catch (JourneyAssistantUpstreamException)
    {
        return Results.Problem(
            title: "Assistant unavailable",
            detail: "The journey assistant is temporarily unavailable.",
            statusCode: StatusCodes.Status502BadGateway);
    }
});

app.MapPost(
    "/api/journeys/{journeyId:guid}/steps/{stepId:guid}/complete",
    async (
        Guid journeyId,
        Guid stepId,
        CompleteStepRequest request,
        IJourneyService journeyService) =>
    {
        try
        {
            var journey = await journeyService.CompleteStepAsync(
                journeyId,
                stepId,
                request.Result
            );

            return Results.Ok(
                JourneyMapper.ToResponse(journey)
            );
        }
        catch (InvalidOperationException ex)
        {
            return Results.BadRequest(new
            {
                message = ex.Message
            });
        }
    });

    app.MapPost(
    "/api/journeys/{journeyId:guid}/steps/{stepId:guid}/retry",
    async (
        Guid journeyId,
        Guid stepId,
        IJourneyService journeyService) =>
    {
        try
        {
            var journey = await journeyService.RetryStepAsync(
                journeyId,
                stepId
            );

            return Results.Ok(
                JourneyMapper.ToResponse(journey)
            );
        }
        catch (InvalidOperationException ex)
        {
            return Results.BadRequest(new
            {
                message = ex.Message
            });
        }
    });

    app.MapPost(
    "/api/journeys/{journeyId:guid}/waiting-period/evaluate",
    async (
        Guid journeyId,
        IJourneyService journeyService) =>
    {
        try
        {
            var journey = await journeyService.EvaluateWaitingPeriodAsync(
                journeyId
            );

            return Results.Ok(
                JourneyMapper.ToResponse(journey)
            );
        }
        catch (InvalidOperationException ex)
        {
            return Results.BadRequest(new
            {
                message = ex.Message
            });
        }
    });

    app.MapPost(
    "/api/journeys/{journeyId:guid}/steps/{stepId:guid}/requirements/{requirementId:guid}/complete",
    async (
        Guid journeyId,
        Guid stepId,
        Guid requirementId,
        IJourneyService journeyService) =>
    {
        try
        {
            var journey = await journeyService.CompleteRequirementAsync(
                journeyId,
                stepId,
                requirementId
            );

            return Results.Ok(
                JourneyMapper.ToResponse(journey)
            );
        }
        catch (InvalidOperationException ex)
        {
            return Results.BadRequest(new
            {
                message = ex.Message
            });
        }
    });

app.UseCors("Frontend");

app.UseHttpsRedirection();

app.MapGet("/api/health", () => Results.Ok(new
{
    status = "ok",
    service = "Build What Moves India API"
}));

app.Run();
