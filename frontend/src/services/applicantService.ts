import type {
  CreateApplicantRequest,
  Applicant,
} from '../types/applicant';
import type { Journey } from '../types/journey';

const API_BASE_URL = 'http://localhost:5204';

export const createApplicant = async (
  request: CreateApplicantRequest,
): Promise<Applicant> => {
  const response = await fetch(
    `${API_BASE_URL}/api/applicants`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    },
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.message ?? 'Failed to create applicant.',
    );
  }

  return response.json();
};

export const createJourney = async (
  applicantId: string,
): Promise<Journey> => {
  const response = await fetch(
    `${API_BASE_URL}/api/applicants/${applicantId}/journey`,
    {
      method: 'POST',
    },
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.message ?? 'Failed to create journey.',
    );
  }

  return response.json();
};