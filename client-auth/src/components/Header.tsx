import { useNavigate } from 'react-router-dom';
import { Button } from '@gravity-ui/uikit';

import ThemeButton from './ThemeButton';
import Navbar from './Navbar';
import HeaderMenu from './HeaderMenu';

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="blog-header">
      <div className="header-container">
        <Button
          view="flat"
          size="m"
          onClick={() => navigate('/')}
        >
          NTLSTL
        </Button>
        <Navbar />
        <div className="header-actions">
          <HeaderMenu />
          <ThemeButton />
        </div>
      </div>
    </header>
  );
}
