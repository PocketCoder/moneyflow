import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import {Auth0ProviderWithNavigate} from './auth0-provider-with-navigate';
import App from './App.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<BrowserRouter>
			<Auth0ProviderWithNavigate>
				<App />
			</Auth0ProviderWithNavigate>
		</BrowserRouter>
	</React.StrictMode>
);
