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
          view="outlined-action"
          size="m"
          onClick={() => navigate('/')}
        >
          NTLSTL
        </Button>
        <ThemeButton />
      </div>
      <Navbar />
      <HeaderMenu />
    </header>
  );
}
