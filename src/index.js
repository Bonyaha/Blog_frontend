import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from 'react-query'
import { UserProvider } from './UserContext'
import { NotificationProvider } from './NotificationContext'
import App from './App'
import './style.css'

const queryClient = new QueryClient()
ReactDOM.createRoot(document.getElementById('root')).render(
	<QueryClientProvider client={queryClient}>
		<UserProvider>
			<NotificationProvider>
				<App />
			</NotificationProvider>
		</UserProvider>
	</QueryClientProvider>
)
