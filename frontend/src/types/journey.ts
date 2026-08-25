export type RequirementStatus =
  | 'Pending'
  | 'Completed'
  | 'NotApplicable';

export type JourneyStepStatus =
  | 'Locked'
  | 'Available'
  | 'InProgress'
  | 'Completed'
  | 'Failed';

export type Requirement = {
  id: string;
  type: string;
  title: string;
  description: string;
  required: boolean;
  status: RequirementStatus;
};

export type JourneyStep = {
  id: string;
  type: string;
  status: JourneyStepStatus;
  order: number;
  title: string;
  description: string;
  requirements: Requirement[];
};

export type Journey = {
  id: string;
  applicantId: string;
  journeyType: string;
  status: string;
  currentStep: string;
  createdAt: string;
  updatedAt: string;
  learnerLicenceIssuedAt: string | null;
  steps: JourneyStep[];
};