/**
 * Main entry point for the Scrapify React application
 */

import * as FullStory from '@fullstory/browser';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Initialize FullStory
const fullstoryOrgId = import.meta.env.VITE_FULLSTORY_ORG_ID;
if (fullstoryOrgId) {
  FullStory.init({ orgId: fullstoryOrgId });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
