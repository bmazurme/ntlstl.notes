import { useNavigate } from 'react-router-dom';
import { Button } from '@gravity-ui/uikit';

import { useLoginMutation, useLogoutMutation } from '../store/api/auth-api/endpoints';
import { useAppDispatch } from '../hooks';
import { logout, setCredentials } from '../store';

import ProtectedWrapper from './ProtectedWrapper';

export default function HeaderMenu() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login] = useLoginMutation();
  const [logoutAuth] = useLogoutMutation();

  const handleLogin = async () => {
    try {
      const response = await login({ username: 'john', password: 'changeme' }).unwrap();
      console.log('Login successful:', response);
      dispatch(setCredentials({ accessToken: response.accessToken, isAuthenticated: true }));
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutAuth().unwrap();
      dispatch(logout());
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="header-menu">
      <nav>
        <ul className="g-list">
          <ProtectedWrapper
            fallback={
              <li className="g-list__item">
                <Button
                  view="outlined-action"
                  size="s"
                  onClick={handleLogin}
                >
                  Login
                </Button>
              </li>
            }
          >
            <>
              <li className="g-list__item">
                <Button
                  view="outlined-action"
                  size="s"
                  onClick={() => navigate('/profile')}
                >
                  Profile Page
                </Button>
              </li>
              <li className="g-list__item">
                <Button
                  view="outlined-action"
                  size="s"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </li>
            </>
          </ProtectedWrapper>
        </ul>
      </nav>
    </div>
  );
}
