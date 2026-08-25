import type { Journey } from '../types/journey';

const API_BASE_URL = 'http://localhost:5204';

export const getJourney = async (
  applicantId: string,
): Promise<Journey> => {
  const response = await fetch(
    `${API_BASE_URL}/api/applicants/${applicantId}/journey`,
  );

  if (!response.ok) {
    throw new Error('Failed to load journey.');
  }

  return response.json();
};

export const completeRequirement = async (
  journeyId: string,
  stepId: string,
  requirementId: string,
): Promise<Journey> => {
  const response = await fetch(
    `${API_BASE_URL}/api/journeys/${journeyId}/steps/${stepId}/requirements/${requirementId}/complete`,
    {
      method: 'POST',
    },
  );

  if (!response.ok) {
    throw new Error('Failed to complete requirement.');
  }

  return response.json();
};

export const completeStep = async (
  journeyId: string,
  stepId: string,
  result: 'Pass' | 'Fail',
): Promise<Journey> => {
  const response = await fetch(
    `${API_BASE_URL}/api/journeys/${journeyId}/steps/${stepId}/complete`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ result }),
    },
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.message ?? 'Failed to complete journey step.',
    );
  }

  return response.json();
};

export const evaluateWaitingPeriod = async (
  journeyId: string,
): Promise<Journey> => {
  const response = await fetch(
    `${API_BASE_URL}/api/journeys/${journeyId}/waiting-period/evaluate`,
    {
      method: "POST",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to evaluate waiting period.");
  }

  return response.json();
};

export const retryStep = async (
  journeyId: string,
  stepId: string,
): Promise<Journey> => {
  const response = await fetch(
    `${API_BASE_URL}/api/journeys/${journeyId}/steps/${stepId}/retry`,
    {
      method: "POST",
    },
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.message ?? "Failed to retry journey step.",
    );
  }

  return response.json();
};