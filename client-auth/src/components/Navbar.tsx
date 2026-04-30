import { useNavigate } from 'react-router-dom';
import { Button } from '@gravity-ui/uikit';

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="blog-nav">
      <ul className="g-list">
        <li className="g-list__item">
          <Button
            view="outlined-action"
            size="s"
            onClick={() => navigate('/kit')}
          >
            Kit Page
          </Button>
        </li>
        <li className="g-list__item">
          <Button
            view="outlined-action"
            size="s"
            onClick={() => navigate('/any')}
          >
            Any Page
          </Button>
        </li>
      </ul>
    </nav>
  );
}
