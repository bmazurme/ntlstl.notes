import { Button } from '@gravity-ui/uikit';
import { useNavigate } from 'react-router-dom';

import HeaderMenu from '../header-menu';
import Navbar from '../navbar';
import ThemeButton from '../theme-button';

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="blog-header">
      <div className="header-container">
        <div className="header-brand">
          <Button
            view="flat"
            size="m"
            aria-label="NTLSTL — перейти на главную"
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
