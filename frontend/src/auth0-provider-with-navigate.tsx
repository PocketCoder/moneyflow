import {Auth0Provider} from '@auth0/auth0-react';
import {useNavigate} from 'react-router-dom';

export const Auth0ProviderWithNavigate = ({children}) => {
	const navigate = useNavigate();

	const domain = process.env.VITE_AUTH0_DOMAIN;
	const clientId = process.env.VITE_AUTH0_CLIENT_ID;
	const redirectUri = process.env.VITE_AUTH0_CALLBACK_URL;

	const onRedirectCallback = (appState) => {
		navigate(appState?.returnTo || window.location.pathname);
	};

	if (!(domain && clientId && redirectUri)) {
		return null;
	}

	return (
		<Auth0Provider
			domain={domain}
			clientId={clientId}
			authorizationParams={{
				redirect_uri: redirectUri,
				audience: process.env.VITE_AUTH0_AUDIENCE
			}}
			onRedirectCallback={onRedirectCallback}
			useRefreshTokens={true}
			cacheLocation="localstorage">
			{children}
		</Auth0Provider>
	);
};
