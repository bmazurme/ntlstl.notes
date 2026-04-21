import type { PropsWithChildren } from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';

import ContentWrapper from './ContentWrapper';

import style from './ErrorBoundaryWrapper.module.css';

type ErrorBoundaryWrapperProps = PropsWithChildren<unknown>;

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const navigate = useNavigate();
  const navigateHome = () => {
    resetErrorBoundary();
    navigate('/');
  };
  
  console.log(error);
  return (
    <ContentWrapper
      children={(
        <div className={style.boundary}>
          <h2 className={style.title}>APP-ERROR</h2>
          {/* <p className={style.message}>{error.message}</p> */}
          <div className={style.block}>
            Try to
            <button
              className="counter"
              onClick={resetErrorBoundary}
            >
              Reload app
            </button>
            or
            <button className="counter" onClick={navigateHome}>
              Go to homepage
            </button>
          </div>
        </div>
      )}
    />
  );
}

export default function ErrorBoundaryWrapper({ children }: ErrorBoundaryWrapperProps) {
  return (
    <ErrorBoundary onReset={() => console.log('reset')} FallbackComponent={ErrorFallback}>
      {children}
    </ErrorBoundary>
  );
}
