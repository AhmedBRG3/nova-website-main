import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { loadContent } from './data/caseStudies';

// Fetch the CMS-managed content first so every component can read it synchronously.
loadContent().finally(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});

// Always open on the opening scene, not wherever the last visit left off.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
