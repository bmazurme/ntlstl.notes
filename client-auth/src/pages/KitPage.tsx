import { useNavigate } from 'react-router-dom';
import { Button } from '@gravity-ui/uikit';

import ErrorBoundaryWrapper from '../components/ErrorBoundaryWrapper';
import BrokenComponent from '../components/BrokenComponent';

function KitPage() {
  const navigate = useNavigate();

  return (
    <>
      <ErrorBoundaryWrapper>
        <section id="center">
          <Button
            view="outlined-action"
            size="m"
            onClick={() => navigate('/')}
          >
            To Main
          </Button>
          <BrokenComponent />
        </section>
      </ErrorBoundaryWrapper>
    </>
  )
}

export default KitPage;
