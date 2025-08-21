import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react'
import App from './App.jsx'
import './index.css'

// Auth0 configuration with fallback for demo
const domain = import.meta.env.VITE_AUTH0_DOMAIN || 'demo-trip-planner.us.auth0.com'
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID || 'demo-client-id'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      <App />
    </Auth0Provider>
  </StrictMode>,
)