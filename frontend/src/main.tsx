/**
 * Main entry point for the Scrapify React application
 */

import { init as initFullStory } from '@fullstory/browser';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';




// Initialize FullStory - the SDK creates a global FS object
const fullstoryOrgId = import.meta.env.VITE_FULLSTORY_ORG_ID;
if (fullstoryOrgId) {
  initFullStory({ orgId: fullstoryOrgId })
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
