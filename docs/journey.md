# LL → DL Journey

## 1. Journey Objective

The MVP focuses on one concrete journey:

> A first-time applicant in Karnataka progressing from Learner's Licence
> (LL) to Driving Licence (DL).

The product does not attempt to reproduce every Sarathi/Parivahan screen.

Instead, it provides a simplified, guided and personalized experience that
helps the citizen understand:

- What they need to do
- Why they need to do it
- What documents are required
- What they can do now
- What is blocked
- What comes next
- What they can prepare in advance

All government interactions are simulated for the hackathon prototype.

---

# 2. Journey Scope

### In scope

- First-time driving licence journey
- Karnataka
- Learner's Licence → Driving Licence
- Motorcycle / car vehicle categories
- Eligibility guidance
- Document guidance
- Synthetic identity verification
- Mock payments
- Learner's Licence knowledge test
- Learner's Licence issuance
- Waiting-period representation
- Driving Licence application
- Driving test appointment
- Synthetic driving test result
- Driving Licence issuance
- Journey progress tracking

### Out of scope

- Real Aadhaar authentication
- Real government API integrations
- Real payments
- Real licence issuance
- Real document uploads to government systems
- Actual driving simulation
- Real government identity data
- Supporting every Indian state
- Every possible licence/service type

---

# 3. High-Level Journey

The complete journey is:

START
  ↓
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
  ↓
COMPLETE

---

# 4. Journey Step Lifecycle

Every journey step has one of the following statuses:

```text
LOCKED
AVAILABLE
IN_PROGRESS
COMPLETED
FAILED