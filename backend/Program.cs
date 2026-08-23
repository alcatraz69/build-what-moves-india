using backend.Application.Applicants;
using backend.Application.Rules;
using backend.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

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

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

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

app.UseCors("Frontend");

app.UseHttpsRedirection();

app.MapGet("/api/health", () => Results.Ok(new
{
    status = "ok",
    service = "Build What Moves India API"
}));

app.Run();