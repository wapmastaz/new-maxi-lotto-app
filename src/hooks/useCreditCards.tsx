
import { fetchUserCreditCards } from '@/services/CreditCardService';
import type { DebitCard } from '@/types/user';
import { useQuery } from '@tanstack/react-query';

export const useGetCreditCards = () => {
  return useQuery<DebitCard[], Error>({
    queryKey: ['creditCards'],
    queryFn: () => fetchUserCreditCards(),
  });
};

