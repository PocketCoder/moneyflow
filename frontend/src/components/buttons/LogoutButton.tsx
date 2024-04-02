import {Button} from '@tremor/react';
import {useAuth0} from '@auth0/auth0-react';
import {ArrowRightStartOnRectangleIcon} from '@heroicons/react/24/outline';

export const LogoutButton = () => {
	const {isAuthenticated, logout} = useAuth0();

	return (
		isAuthenticated && (
			<Button
				variant="secondary"
				icon={ArrowRightStartOnRectangleIcon}
				iconPosition="right"
				onClick={() => {
					logout({
						logoutParams: {
							returnTo: window.location.origin
						}
					});
				}}>
				Logout
			</Button>
		)
	);
};
