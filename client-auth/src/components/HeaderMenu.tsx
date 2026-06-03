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
      dispatch(setCredentials({ accessToken: response.accessToken, isAuthenticated: true }));
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutAuth().unwrap();
      dispatch(logout());
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="header-menu">
      <ProtectedWrapper
        fallback={
          <Button view="outlined-action" size="m" onClick={handleLogin}>
            Login
          </Button>
        }
      >
        <>
          <Button view="flat" size="m" onClick={() => navigate('/profile')}>
            Profile
          </Button>
          <Button view="outlined-danger" size="m" onClick={handleLogout}>
            Logout
          </Button>
        </>
      </ProtectedWrapper>
    </div>
  );
}
