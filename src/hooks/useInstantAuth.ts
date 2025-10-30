import { useState, useEffect } from 'react';
import useAuthStore from '@/store/authStore';

export const useInstantAuth = () => {
	const { isAuthenticated, accessToken } = useAuthStore((s) => s);
	const [auth, setAuth] = useState(false);

	useEffect(() => {
		const cookieAuth = !!accessToken;

		setAuth(cookieAuth);
	}, []);

	return isAuthenticated || auth;
};
