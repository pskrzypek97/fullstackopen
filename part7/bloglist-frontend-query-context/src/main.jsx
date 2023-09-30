import React from 'react';
import ReactDOM from 'react-dom/client';

import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NotificationContextProvider } from './store/NotificationContext.jsx';
import { UserContextProvider } from './store/UserContext.jsx';

import App from './App.jsx';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<Router>
			<QueryClientProvider client={queryClient}>
				<UserContextProvider>
					<NotificationContextProvider>
						<App />
					</NotificationContextProvider>
				</UserContextProvider>
			</QueryClientProvider>
		</Router>
	</React.StrictMode>
);
