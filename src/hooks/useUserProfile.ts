import {
	fetchBanks,
	fetchDebitCards,
	fetchFavouriteBalls,
	fetchUserProfile,
} from '@/services/UserService';
import type { Bank, User } from '@/types/user';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';

export const useUserProfile = () => {
	return useSuspenseQuery<User, Error>({
		queryKey: ['userProfile'],
		queryFn: fetchUserProfile,
		select: (data) => {
			return data;
		},
	});
};

export const useFetchBanks = () => {
	return useQuery<Bank[], Error>({
		queryKey: ['banks'],
		queryFn: () => fetchBanks(),
	});
};

export const useFetchDebitCards = () => {
	return useQuery<Bank[], Error>({
		queryKey: ['debit_cards'],
		queryFn: () => fetchDebitCards(),
	});
};

export const useFetchFavouriteBalls = () => {
	return useSuspenseQuery<number[], Error>({
		queryKey: ['favourite_balls'],
		queryFn: () => fetchFavouriteBalls(),
	});
};
