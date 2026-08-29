export type VehicleType = 'MCWG' | 'LMV';

export type CreateApplicantRequest = {
  age: number;
  state: string;
  city: string;
  isFirstLicence: boolean;
  vehicleTypes: VehicleType[];
};

export type RuleFailure = {
  rule: string;
  category: string;
  message: string;
};

export type Applicant = {
  id: string;
  age: number;
  state: string;
  city: string;
  isFirstLicence: boolean;
  vehicleTypes: VehicleType[];
  isEligible: boolean;
  failures: RuleFailure[];
  referenceNumber: string;
};