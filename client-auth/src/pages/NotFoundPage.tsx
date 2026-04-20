import { useNavigate } from 'react-router-dom';

import heroImg from '../assets/hero.png';

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
        </div>
        <button
          className="counter"
          onClick={() => navigate('/')}
        >
          To Main
        </button>
      </section>
    </>
  )
}

export default NotFoundPage;
