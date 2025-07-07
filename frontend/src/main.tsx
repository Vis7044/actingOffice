import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import { AuthProvider } from './Auth/authContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FluentProvider theme={webLightTheme}>
    <AuthProvider>
    <App />

    </AuthProvider>
    </FluentProvider>
  </StrictMode>,
)
