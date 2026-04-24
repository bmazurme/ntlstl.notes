import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@gravity-ui/uikit';

import { useAppDispatch } from '../hooks';
import { useLogoutMutation, useCheckAuthQuery } from '../store/api/auth-api/endpoints';
import { useGetUserInfoMutation } from '../store/api/users-api/endpoints';

import { setCredentials, logout, setChecking } from '../store/slices/auth-slice';

import ProtectedWrapper from '../components/ProtectedWrapper';
import RedirectToLogin from '../components/RedirectToLogin';

function ProtectedPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [logoutAuth] = useLogoutMutation();
  const { data, isLoading, error } = useCheckAuthQuery();
  const [getUserInfo] = useGetUserInfoMutation();

  const handleLogout = async () => {
    try {
      await logoutAuth().unwrap();
      dispatch(logout());
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  const handleGetUserInfo = useCallback(async () => {
    try {
      const response = await getUserInfo().unwrap();
      console.log('User info:', response);
    } catch (error) {
      console.error('Failed to fetch user info:', error);
    }
  }, [getUserInfo]);

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
        <ProtectedWrapper fallback={<RedirectToLogin />}>
          <Button
            view="outlined-action"
            size="m"
            onClick={() => navigate('/')}
          >
            To Main
          </Button>
          <Button
            view="outlined-action"
            size="m"
            onClick={handleGetUserInfo}
          >
            Get info
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

export default ProtectedPage;
