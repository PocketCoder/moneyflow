import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import {Auth0ProviderWithNavigate} from './auth0-provider-with-navigate';
import {QueryClient, QueryClientProvider} from 'react-query';
import App from './App.tsx';
import './index.css';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false
		}
	}
});

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<Auth0ProviderWithNavigate>
					<App />
				</Auth0ProviderWithNavigate>
			</BrowserRouter>
		</QueryClientProvider>
	</React.StrictMode>
);
