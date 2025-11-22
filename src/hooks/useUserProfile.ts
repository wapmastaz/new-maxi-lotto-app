import {
	fetchBanks,
	fetchDebitCards,
	fetchFavouriteBalls,
	fetchUserProfile,
} from '@/services/UserService';
import type { Bank, User, MinimalUser } from '@/types/user';
import { useQuery } from '@tanstack/react-query';

export const useUserProfile = () => {
	return useQuery<User, Error>({
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

export const useFetchFavouriteBalls = (user?: MinimalUser | null) => {
	return useQuery<number[], Error>({
		queryKey: ['favourite_balls'],
		queryFn: () => fetchFavouriteBalls(),
		enabled: !!user,
	});
};
