# Domain Model

## 1. Purpose

The application provides a citizen-first experience for navigating the
Learner's Licence (LL) → Driving Licence (DL) journey.

The domain model intentionally focuses on the information required to:

- Understand the applicant's goal
- Determine eligibility
- Build a personalized journey
- Track journey progress
- Manage requirements
- Represent issued licences

The MVP uses synthetic data and does not store real government identity data.

---

## 2. Core Domain Entities

### Applicant

Represents the citizen using the application.

| Field | Type | Description |
|-------|------|-------------|
| Id    | Guid | Unique applicant identifier |
| Age   | int  | Applicant's age |
| State | string | State of application |
| City  | string | City of application |
| IsFirstLicence | bool | Whether this is the applicant's first driving licence |
| VehicleTypes | List<VehicleType> | Vehicle categories requested |

Example:

```json
{
  "age": 18,
  "state": "Karnataka",
  "city": "Bengaluru",
  "isFirstLicence": true,
  "vehicleTypes": [
    "Motorcycle",
    "Car"
  ]
}

--- 

## 3. Domain Architecture

The application separates responsibilities across four major areas:

```text
User
  ↓
AI / Intent Extraction
  ↓
Journey Intent
  ↓
Rules Engine
  ↓
Applicant + Journey
  ↓
Journey Engine
  ↓
Journey State
  ↓
Frontend