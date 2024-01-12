import {Button} from '@tremor/react';
import {useAuth0} from '@auth0/auth0-react';

export const LoginButton = () => {
	const {isAuthenticated, loginWithRedirect} = useAuth0();

	return (
		!isAuthenticated && (
			<Button
				size="xl"
				onClick={() => {
					loginWithRedirect();
				}}>
				Log in
			</Button>
		)
	);
};
