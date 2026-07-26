import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import SmoothScroll from './components/SmoothScroll.tsx'
import PageLoader from './components/PageLoader.tsx'
import ReferralCapture from './components/ReferralCapture.tsx'
import './index.css'
import App from './App.tsx'
import './i18n'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <PageLoader />
      <ReferralCapture />
      <SmoothScroll>
        <App />
      </SmoothScroll>
    </HelmetProvider>
  </StrictMode>,
)
