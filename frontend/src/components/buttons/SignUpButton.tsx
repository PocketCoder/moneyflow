import {Button} from '@tremor/react';
import {useAuth0} from '@auth0/auth0-react';

export const SignupButton = () => {
	const {isAuthenticated, loginWithRedirect} = useAuth0();

	const handleSignup = async () => {
		await loginWithRedirect({
			appState: {
				returnTo: '/profile'
			},
			authorizationParams: {
				screen_hint: 'signup'
			}
		});
	};

	return (
		!isAuthenticated && (
			<Button size="xl" onClick={handleSignup}>
				Log in
			</Button>
		)
	);
};
