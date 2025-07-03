import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { FluentProvider } from '@fluentui/react-components';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FluentProvider>

    <App />
    </FluentProvider>
  </StrictMode>,
)
