import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { useLoginMutation, useLogoutMutation, useCheckAuthQuery } from '../store/api/auth-api/endpoints';
import { useGetUserInfoMutation } from '../store/api/users-api/endpoints';

import { setCredentials, logout, setChecking } from '../store/slices/auth-slice';

import ProtectedWrapper from '../components/ProtectedWrapper';

import heroImg from '../assets/hero.png';
// import type { RootState } from '../store';

function MainPage() {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login] = useLoginMutation();
  const [logoutAuth] = useLogoutMutation();
  const { data, isLoading, error } = useCheckAuthQuery();
  const [getUserInfo] = useGetUserInfoMutation();

  const handleLogin = async () => {
    try {
      const response = await login({ username: 'john', password: 'changeme' }).unwrap();
      console.log('Login successful:', response);
      dispatch(setCredentials({ accessToken: response.accessToken, isAuthenticated: true }));
    } catch (error) {
      console.error('Login failed:', error);
    }
  }

  const handleLogout = async () => {
    try {
      await logoutAuth().unwrap();
      dispatch(logout());
      // refetch();
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
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
        </div>
        <button
          className="counter"
          onClick={handleLogin}
        >
          Login
        </button>
        <button
          className="counter"
          onClick={() => navigate('/any')}
        >
          Any Page
        </button>
        <button
          className="counter"
          onClick={() => navigate('/kit')}
        >
          Kit Page
        </button>
        <ProtectedWrapper>
          <button
            className="counter"
            onClick={handleGetUserInfo}
          >
            Get info
          </button>
          <button
            className="counter"
            onClick={handleLogout}
          >
            Logout
          </button>
        </ProtectedWrapper>
      </section>
    </>
  )
}

export default MainPage;
