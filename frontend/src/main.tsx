import ReactDOM from 'react-dom/client';
import { Suspense, StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LoadingBarContainer } from 'react-top-loading-bar';

import App from './app';

// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <Suspense>
          <LoadingBarContainer>
            <App />
          </LoadingBarContainer>
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);
