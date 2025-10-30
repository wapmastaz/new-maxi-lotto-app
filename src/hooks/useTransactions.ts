import { fetchTransactions } from '@/services/Transactions';
import { Transaction } from '@/types/transaction';
import { useQuery } from '@tanstack/react-query';

export const useFetchTransactions = (filters: {
	startDate?: string;
	endDate?: string;
	isPaid?: boolean;
	customer?: number;
}) => {
	return useQuery<Transaction[], Error>({
		queryKey: ['transactions', filters], // include filters in queryKey
		queryFn: () => fetchTransactions(filters),
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
};
