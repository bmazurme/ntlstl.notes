import { useNavigate } from 'react-router-dom';
import { Button } from '@gravity-ui/uikit';

import heroImg from '../assets/hero.png';

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
        </div>
        <Button
          view="outlined-action"
          size="m"
          onClick={() => navigate('/')}
        >
          To Main
        </Button>
      </section>
    </>
  )
}

export default NotFoundPage;
