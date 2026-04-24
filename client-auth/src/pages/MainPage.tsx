import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@gravity-ui/uikit';

import { useAppDispatch } from '../hooks';
import { useLoginMutation, useLogoutMutation, useCheckAuthQuery } from '../store/api/auth-api/endpoints';
import { setCredentials, logout, setChecking } from '../store/slices/auth-slice';

import ProtectedWrapper from '../components/ProtectedWrapper';

import heroImg from '../assets/hero.png';

function MainPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login] = useLoginMutation();
  const [logoutAuth] = useLogoutMutation();
  const { data, isLoading, error } = useCheckAuthQuery();

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
      // refetch();
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    if (isLoading) {
      dispatch(setChecking());
    } else if (error) {
      dispatch(logout());
    } else if (data?.isAuthenticated) {
      console.log(data);

      if (data.accessToken) {
        dispatch(setCredentials({ accessToken: data.accessToken, isAuthenticated: true }));
      }
    } else {
      dispatch(logout());
    }
  }, [data, isLoading, dispatch, error]);

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
        </div>
        <Button
          view="outlined-action"
          size="m"
          onClick={() => navigate('/any')}
        >
          Any Page
        </Button>
        <Button
          view="outlined-action"
          size="m"
          onClick={() => navigate('/kit')}
        >
          Kit Page
        </Button>
        <Button
          view="outlined-action"
          size="m"
          onClick={handleLogin}
        >
          Login
        </Button>

        <ProtectedWrapper>
          <Button
            view="outlined-action"
            size="m"
            onClick={() => navigate('/protected')}
          >
            Protected Page
          </Button>
          <Button
            view="outlined-action"
            size="m"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </ProtectedWrapper>
      </section>
    </>
  )
}

export default MainPage;
