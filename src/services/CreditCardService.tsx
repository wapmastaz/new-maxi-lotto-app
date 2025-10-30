/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DebitCard } from "@/types/user";
import apiClient from "@/utils/apiClient";

export const fetchUserCreditCards = async (): Promise<DebitCard[]> => {
  try {
    const response = await apiClient.get<DebitCard[]>(
      'Card');
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(
        error.response.data.message || 'Failed to fetch daily games.'
      );
    }
    throw new Error('Network error, please try again.');
  }
};