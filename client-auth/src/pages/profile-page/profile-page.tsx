/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useState } from 'react';
import { Text } from '@gravity-ui/uikit';

import { useGetUserInfoMutation } from '../../store/api/users-api/endpoints';

import ProtectedWrapper from '../../components/protected-wrapper';
import RedirectToLogin from '../../components/redirect-to-login';
import ContentWrapper from '../../components/content-wrapper';

function ProfilePage() {
  const [getUserInfo] = useGetUserInfoMutation();
  const [username, setUsername] = useState<string | null>(null);

  const handleGetUserInfo = useCallback(async () => {
    try {
      const response = await getUserInfo().unwrap();
      setUsername(response.username);
    } catch (error) {
      console.error('Failed to fetch user info:', error);
    }
  }, [getUserInfo]);

  useEffect(() => {
    handleGetUserInfo();
  }, []);

  return (
    <ContentWrapper
      children={(
        <section id="center">
          <Text variant="header-2">Profile</Text>
          <ProtectedWrapper fallback={<RedirectToLogin />}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
              <Text variant="body-2" color="secondary">Логин</Text>
              <Text variant="body-1">{username ?? '—'}</Text>
            </div>
          </ProtectedWrapper>
        </section>)}
      sidebar
    />
  )
}

export default ProfilePage;
