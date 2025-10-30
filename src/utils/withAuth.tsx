
import useAuthStore from '@/store/authStore';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useState, type ComponentType } from 'react';

const withAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
	return (props: P) => {
		const navigate = useNavigate();
		const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
		const accessToken = useAuthStore.getState().accessToken;

		useEffect(() => {
			if (!accessToken) {
				navigate({
					to: '/',
					replace: true,
				})
			} else {
				setIsAuthenticated(true);
			}
		}, [navigate, accessToken]);

		// Prevent rendering the component until authentication is checked
		if (isAuthenticated === null) {
			// return <LoadingComp />;
		}

		return <WrappedComponent {...props} />;
	};
};

export default withAuth;
