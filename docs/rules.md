# Rules & Journey Configuration

## 1. Purpose

This document defines the deterministic rules and configurable journey information used by the Build What Moves India MVP for the Karnataka first-time Learner's Licence (LL) → Driving Licence (DL) journey.

The Rules Engine is the source of truth for deterministic:

- Eligibility
- Requirements
- Time-based constraints
- Assessment outcomes
- Journey constraints
- Configurable values such as fees

AI must not make these decisions.

---

## 2. Scope

The MVP supports:

- State: Karnataka
- Journey: First Driving Licence
- Vehicle categories:
  - MCWG — Motorcycle With Gear
  - LMV — Light Motor Vehicle / private motor car
- Licence stages:
  - Learner's Licence
  - Driving Licence

The application uses synthetic data and simulated government interactions.

The product is a citizen-first experience and does not attempt to reproduce every Sarathi/Parivahan screen or internal government workflow.

---

## 3. Rule Categories

The Rules Engine evaluates several categories of deterministic rules.

### 3.1 Eligibility Rules

Determine whether an applicant can begin or continue a journey.

Examples:

- Minimum age
- Vehicle category eligibility
- First-licence journey eligibility

### 3.2 Requirement Rules

Determine what the applicant needs for a particular journey step.

Examples:

- Proof of address and age
- Physical fitness declaration
- Medical certificate where applicable
- Other applicable documents

### 3.3 Temporal Rules

Determine whether an applicant can proceed based on time.

Example:

- Minimum Learner's Licence holding period before the Driving Licence competence test

### 3.4 Assessment Rules

Determine progression based on test outcomes.

Examples:

- Learner's Licence preliminary test passed
- Driving competence test passed

### 3.5 Configuration Rules

Represent values that may change independently of application code.

Examples:

- Fees
- Journey step descriptions
- Requirement descriptions
- Vehicle category labels

---

## 4. Eligibility Rules

### 4.1 MCWG

For the private first-time journey supported by this MVP:

**Minimum age: 18 years**

### 4.2 LMV

For the private first-time journey supported by this MVP:

**Minimum age: 18 years**

### 4.3 First Licence

The MVP is designed for applicants seeking their first driving licence.

The applicant is expected to confirm that they do not already hold a valid driving licence.

If the applicant indicates that they already hold a valid driving licence, the MVP should not continue with the first-time applicant journey.

This is an MVP journey-selection rule and should not be interpreted as a complete representation of all real-world driving-licence services.

---

## 5. Learner's Licence Rules

### 5.1 LL Validity

A Learner's Licence is valid for 6 months.

The application should communicate the validity period clearly to the citizen.

### 5.2 Minimum LL Holding Period Before DL Test

An applicant who has held a valid Learner's Licence for at least 30 days is eligible to appear for the Driving Licence competence test.

The Journey Engine must therefore prevent the Driving Test step from becoming available before the required period has elapsed.

---

## 6. Document Rules

The MVP presents document requirements using citizen-friendly categories.

Initial requirement categories include:

- Proof of address and age
- Physical fitness declaration where applicable
- Medical certificate where applicable
- Photograph
- Other applicable supporting documents

The exact acceptable documents and conditions should be treated as configurable rules rather than hardcoded frontend logic.

Official Parivahan documentation lists examples of proof of address and age including:

- Aadhaar Card
- Electoral Roll
- Life Insurance Policy
- Passport
- School Certificate
- Birth Certificate
- Government/local-body pay slip
- Other documents specified by the State Government

The prototype should not imply that this list is exhaustive.

---

## 7. Medical / Fitness Rules

Medical and physical-fitness requirements depend on the applicant's circumstances and the applicable licence/service.

For the MVP:

- Physical fitness is represented as a configurable requirement.
- Form 1A should be required when applicable under the official rules.
- The UI should explain the requirement in citizen-friendly language rather than making form numbers the primary user-facing concept.

For the current official Parivahan guidance, Form 1A is required for applicants aged 40 years or above for the relevant Learner's Licence process.

The implementation should keep this rule configurable so that future changes to official requirements do not require changes to the Journey Engine.

---

## 8. Learner's Licence Test

The Learner's Licence process includes a preliminary test covering matters such as:

- Traffic signs
- Traffic signals
- Duties of a driver
- Documents required while driving
- Road-safety knowledge

The MVP represents this as a short synthetic quiz.

### Pass

LL_TEST → COMPLETED → LL_ISSUED

### Fail

LL_TEST → FAILED → RETEST

A failed or absent test should result in a retry/retest path rather than ending the entire journey.

The prototype simulates the test and does not represent an actual government test result.

---

## 9. Driving Test

An applicant must have held a valid Learner's Licence for at least 30 days before appearing for the competence test.

The competence test evaluates the applicant's ability to drive the applicable vehicle class.

The applicant is expected to attend the applicable test appointment with the vehicle type relevant to the application.

### Pass

DRIVING_TEST → COMPLETED → DL_ISSUED

### Fail

DRIVING_TEST → FAILED → RETRY / RESCHEDULE

The prototype uses a synthetic result and does not conduct an actual driving assessment.

---

## 10. Fee Configuration

The MVP treats fees as configurable data.

The following values are used as the initial reference from the official central licensing fee schedule:

| Purpose | Reference Amount |
|---|---:|
| Issue of Learner's Licence per vehicle class | ₹150 |
| Learner's Licence test / repeat test | ₹50 |
| Driving competence test per vehicle class | ₹300 |
| Issue of Driving Licence | ₹200 |

These values must not be hardcoded into frontend components.

The Rules / Configuration layer owns fee values.

The values above are a reference to the central fee schedule. The application must not represent them as guaranteed final Karnataka payable amounts if additional state-specific charges or user charges apply.

Before presenting a fee as a definitive payable amount, the applicable current official charge should be verified.

---

## 11. Journey Configuration

The Rules Engine provides the conditions under which journey steps become available.

The product's simplified citizen journey is:

ELIGIBILITY
↓
LL_APPLICATION
↓
LL_DOCUMENTS
↓
LL_AUTHENTICATION
↓
LL_PAYMENT
↓
LL_TEST
↓
LL_ISSUED
↓
WAITING_PERIOD
↓
DL_APPLICATION
↓
DL_PAYMENT
↓
DRIVING_TEST
↓
DL_ISSUED

This sequence represents the product's simplified citizen experience.

It is not intended to reproduce every Sarathi/Parivahan internal workflow.

Government-facing steps may differ depending on the actual service, authentication mode, RTO and applicable state configuration.

---

## 12. Waiting Period Rule

The MVP represents the minimum LL holding period as:

LL_ISSUED
↓
30 days
↓
DL_APPLICATION / DRIVING_TEST eligibility

The exact transition exposed to the citizen is controlled by the Journey Engine.

The prototype must not allow the applicant to bypass the rule through the frontend.

---

## 13. Synthetic Demo Clock

The hackathon demonstration cannot depend on waiting 30 real days.

The MVP therefore supports a controlled synthetic/demo clock.

The synthetic clock:

- Exists only for the prototype
- Must be clearly identified as simulation
- Must not modify real government records
- Must not imply that a real legal waiting period has been bypassed
- Must only affect the prototype journey state

Example:

Real-world rule:

LL issued → wait at least 30 days

Demo:

LL issued → advance synthetic clock → demonstrate eligible state

---

## 14. Rule Evaluation

The Rules Engine receives structured applicant information.

### Example input

    {
      "age": 18,
      "state": "Karnataka",
      "city": "Bengaluru",
      "isFirstLicence": true,
      "vehicleTypes": [
        "MCWG",
        "LMV"
      ]
    }

The Rules Engine returns deterministic results.

### Example successful evaluation

    {
      "eligible": true,
      "vehicleTypes": {
        "MCWG": {
          "eligible": true
        },
        "LMV": {
          "eligible": true
        }
      },
      "reasons": []
    }

### Example unsuccessful evaluation

    {
      "eligible": false,
      "vehicleTypes": {
        "MCWG": {
          "eligible": true
        },
        "LMV": {
          "eligible": false
        }
      },
      "reasons": [
        {
          "rule": "LMV_MINIMUM_AGE",
          "message": "Applicant does not meet the minimum age requirement for LMV."
        }
      ]
    }

Rules should return structured results rather than only boolean values.

---

## 15. Rule Result

A rule evaluation result should provide:

- Whether the rule passed
- The rule identifier
- The rule category
- A human-readable reason when it fails
- Optional metadata required by the Journey Engine

### Example

    {
      "passed": false,
      "rule": "LMV_MINIMUM_AGE",
      "category": "ELIGIBILITY",
      "reason": "Applicant does not meet the minimum age requirement for LMV."
    }

The Rules Engine must remain deterministic and independently testable.

---

## 16. Journey Transition Rules

The Journey Engine owns journey state and asks the Rules Engine whether a transition is permitted.

Example:

Current Step
↓
Journey Engine
↓
Ask Rules Engine
↓
Evaluate conditions
↓
Rule Result
↓
Allow / Reject transition

### Example

LL_ISSUED
↓
Can DL stage begin?
↓
Check LL validity
Check minimum holding period
Check applicant eligibility
↓
Eligible / Not Eligible

The frontend must never decide whether a journey transition is valid.

---

## 17. AI Boundary

AI may convert natural-language input such as:

"I'm 18, live in Bangalore and want my first licence for a bike and car."

into structured intent:

    {
      "intentType": "FIRST_DRIVING_LICENCE",
      "state": "Karnataka",
      "city": "Bengaluru",
      "isFirstLicence": true,
      "vehicleTypes": [
        "MCWG",
        "LMV"
      ]
    }

AI must not decide:

- Minimum age
- Required documents
- Waiting period
- Fees
- Test eligibility
- Valid journey transitions

Those decisions belong to the Rules Engine and Journey Engine.

---

## 18. Rules vs AI

The system follows this principle:

AI
↓
Understand what the citizen wants

Rules Engine
↓
Determine what the citizen is legally/configurationally allowed to do

Journey Engine
↓
Determine what the citizen can do next

Frontend
↓
Explain it clearly

### Example

User:

"I'm 17 and want a car licence."

AI extracts:

    {
      "age": 17,
      "vehicleTypes": [
        "LMV"
      ]
    }

Rules Engine evaluates:

LMV minimum age = 18
↓
NOT ELIGIBLE

The AI does not override the Rules Engine.

---

## 19. Rule Sources

Rules represented as official requirements should be traceable to authoritative sources.

Primary sources include:

- Ministry of Road Transport & Highways
- Parivahan Sewa
- Central Motor Vehicles Rules
- Official application forms
- Karnataka Transport Department / applicable state authority information

Current reference sources include:

- Parivahan Sewa — Permanent Licence
- Parivahan Sewa — Licensing Fees and Charges
- Parivahan Sewa — Form 2 / document requirements
- Parivahan Sewa — Form 1A guidance

Government rules and fees may change over time.

The implementation should therefore treat rules and configurable values as changeable rather than permanent facts.

---

## 20. Prototype Disclaimer

The application is a hackathon prototype.

It does not:

- Submit applications to the government
- Perform real Aadhaar authentication
- Process real payments
- Issue real licences
- Book real driving-test appointments
- Modify government records

All identities, applications, payments, appointments, test results and licence numbers are synthetic.

The prototype's journey and UX are an abstraction over the real government process and should not be presented as an official government service.