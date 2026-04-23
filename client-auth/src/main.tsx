// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

// import './index.css';
import '@gravity-ui/uikit/styles/fonts.css';
import '@gravity-ui/uikit/styles/styles.css';

import App from './App.tsx';
import { store } from './store';

import ErrorBoundaryWrapper from './components/ErrorBoundaryWrapper.tsx';
import ThemeWrapper from './components/ThemeWrapper.tsx';

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <Provider store={store}>
      <ThemeWrapper>
        <BrowserRouter>
          <ErrorBoundaryWrapper>
            <App />
          </ErrorBoundaryWrapper>
        </BrowserRouter>
      </ThemeWrapper>
    </Provider>,
  // </StrictMode>,
)
