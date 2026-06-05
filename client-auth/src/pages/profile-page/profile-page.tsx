/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useState } from 'react';
import { Text, TextInput } from '@gravity-ui/uikit';

import { useGetUserInfoMutation } from '../../store/api/users-api/endpoints';
import { useIsAuthenticated } from '../../hooks/use-is-authenticated';
import { toaster } from '../../main';

import ProtectedWrapper from '../../components/protected-wrapper';
import RedirectToLogin from '../../components/redirect-to-login';
import ContentWrapper from '../../components/content-wrapper';

import style from './profile.module.css';

function ProfilePage() {
  const [getUserInfo] = useGetUserInfoMutation();
  const [username, setUsername] = useState<string | null>(null);
  const { isAuthenticated } = useIsAuthenticated();

  const handleGetUserInfo = useCallback(async () => {
    try {
      const response = await getUserInfo().unwrap();
      setUsername(response.username);
    } catch {
      toaster.add({ name: 'get-user-info-error', title: 'Не удалось загрузить профиль', theme: 'danger' });
    }
  }, [getUserInfo]);

  useEffect(() => {
    if (isAuthenticated) {
      handleGetUserInfo();
    }
  }, [isAuthenticated, handleGetUserInfo]);

  return (
    <ContentWrapper
      children={(
        <section id="center">
          <ProtectedWrapper fallback={<RedirectToLogin />}>
            <div className={style.container}>
              <Text variant="header-2">Profile</Text>
              <TextInput
                label="Email"
                placeholder="Placeholder"
                disabled
                value={username ?? '—'}
              />
            </div>
          </ProtectedWrapper>
        </section>)}
      sidebar
    />
  )
}

export default ProfilePage;
