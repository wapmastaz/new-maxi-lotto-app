/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DepositResponse } from '@/types/api';
import type { User } from '@/types/user';
import apiClient from '@/utils/apiClient';

export const depositFunds = async (
	customerId: number,
	amount: number,
	paymentProvider: string,
	bankId?: number
): Promise<DepositResponse> => {
	try {
		// /api/Payments/paystack/Deposit/Request
		const response = await apiClient.post<DepositResponse>(
			'Payments/paystack/Deposit/Request',
			{
				customerId,
				amount,
				paymentProvider,
				bankId,
			}
		);
		return response.data;
	} catch (error: any) {
		if (error.response && error.response.data) {
			throw new Error(
				error.response.data.error || 'Deposit failed. Please try again.'
			);
		}
		throw new Error('Network error, please check your connection.');
	}
};

// verify Deposit
// /api/Payments/paystack/verify/{reference}
export const verifyDeposit = async (reference: string): Promise<any> => {
	try {
		const response = await apiClient.post<User>(
			'Payments/paystack/verify/' + reference
		);
		return response.data;
	} catch (error: any) {
		if (error.response && error.response.data) {
			throw new Error(
				error.response.data.error ||
					'Deposit verification failed. Please try again.'
			);
		}
		throw new Error('Network error, please check your connection.');
	}
};
