import {Button} from '@tremor/react';
import {useAuth0} from '@auth0/auth0-react';

export const LoginButton = () => {
	const {isAuthenticated, loginWithRedirect} = useAuth0();

	const handleLogin = async () => {
		await loginWithRedirect({
			appState: {
				returnTo: '/profile'
			}
		});
	};

	return (
		!isAuthenticated && (
			<Button size="xl" onClick={handleLogin}>
				Log in
			</Button>
		)
	);
};
