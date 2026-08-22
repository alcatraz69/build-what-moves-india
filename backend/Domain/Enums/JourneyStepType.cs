namespace backend.Domain.Enums;

public enum JourneyStepType
{
    Eligibility,

    LlApplication,
    LlDocuments,
    LlAuthentication,
    LlPayment,
    LlTest,
    LlIssued,

    WaitingPeriod,

    DlApplication,
    DlPayment,
    DrivingTest,
    DlIssued
}