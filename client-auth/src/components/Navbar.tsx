import { useNavigate } from 'react-router-dom';
import { Button } from '@gravity-ui/uikit';

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="blog-nav">
      {/* <Button view="flat" size="m" onClick={() => navigate('/kit')}>
        Kit
      </Button> */}
      {/* <Button view="flat" size="m" onClick={() => navigate('/add-note')}>
        Add Note
      </Button> */}
      <Button view="flat" size="m" onClick={() => navigate('/oauth')}>
        OAuth
      </Button>
    </nav>
  );
}
