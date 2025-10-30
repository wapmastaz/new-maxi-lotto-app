import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { fetchUserProfile } from '@/services/UserService';
import type { MinimalUser, User } from '@/types/user';

interface AuthStore {
	accessToken: string | null;
	setAccessToken: (accessToken: string) => void;
	clearToken: () => void;
	user: User | null;
	minimalUser: MinimalUser | null;
	setUser: (user: User) => void;
	isAuthenticated: boolean;
	setIsAuthenticated: (isAuthenticated: boolean) => void;
	hydrated: boolean;
	syncUser: () => Promise<void>;
}

const useAuthStore = create<AuthStore>()(
	persist(
		(set) => ({
			hydrated: false,
			accessToken: null,
			isAuthenticated: false,
			user: null,
			minimalUser: null,

			setAccessToken: (accessToken: string) => {
				if (accessToken) set({ accessToken, isAuthenticated: true });
			},

			setUser: (user: User) => {
				if (!user) return;
				const minimalUser: MinimalUser = {
					customerId: user.customerId,
					username: user.username,
					displayName: user.displayName,
					email: user.email,
					phoneNumber: user.phoneNumber,
					token: user.token,
					isVerified: user.isVerified,
					isActive: user.isActive,
					walletBalance: user.wallet.walletBalance,
				};
				set({ user, minimalUser });
			},

			setIsAuthenticated: (isAuthenticated: boolean) =>
				set({ isAuthenticated }),

			clearToken: () => {
				set({
					accessToken: null,
					user: null,
					minimalUser: null,
					isAuthenticated: false,
				});
			},

			syncUser: async () => {
				try {
					const data = await fetchUserProfile();
					if (data) {
						set({ minimalUser: data });
					}
				} catch (error: any) {
					// Check if it's a 401 (expired token)
					if (error?.response?.status === 401) {
						console.warn('Token expired. Logging out.');
						useAuthStore.getState().clearToken();
					} else {
						// Non-auth network or timeout errors should not clear auth
						console.error('Error syncing user:', error?.message || error);
					}
				}
			},
		}),

		{
			name: 'auth-storage',
			storage: createJSONStorage(() =>
				typeof window !== 'undefined'
					? sessionStorage
					: {
							getItem: () => null,
							setItem: () => {},
							removeItem: () => {},
						}
			),
			onRehydrateStorage: () => (state) => {
				if (state) state.hydrated = true;
			},
			partialize: (state) => ({
				accessToken: state.accessToken,
				isAuthenticated: state.isAuthenticated,
				minimalUser: state.minimalUser,
			}),
		}
	)
);

export default useAuthStore;

// ✅ Correct way to type the store context
export type AuthContext = ReturnType<typeof useAuthStore.getState>;
