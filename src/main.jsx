import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Always open on the opening scene, not wherever the last visit left off.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
