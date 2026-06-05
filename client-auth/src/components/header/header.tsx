import { useNavigate } from 'react-router-dom';
import { Button } from '@gravity-ui/uikit';

import ThemeButton from '../theme-button';
import Navbar from '../navbar';
import HeaderMenu from '../header-menu';

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="blog-header">
      <div className="header-container">
        <div className="header-brand">
          <Button
            view="flat"
            size="m"
            onClick={() => navigate('/')}
          >
            NTLSTL
          </Button>
          <Navbar />
        </div>
        <div className="header-actions">
          <HeaderMenu />
          <ThemeButton />
        </div>
      </div>
    </header>
  );
}
