/* eslint-disable react-hooks/set-state-in-effect */
import { Button, Text, TextInput } from '@gravity-ui/uikit';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ContentWrapper from '../../components/content-wrapper';
import PageMeta from '../../components/page-meta';
import ProtectedWrapper from '../../components/protected-wrapper';
import RedirectToLogin from '../../components/redirect-to-login';
import { useIsAuthenticated } from '../../hooks/use-is-authenticated';
import { toaster } from '../../main';
import { useGetNotesByPageMutation } from '../../store/api/notes-api/endpoints';
import {
  useGetUserInfoMutation,
  useUpdateUserMutation,
} from '../../store/api/users-api/endpoints';

import style from './profile.module.css';

function ProfilePage() {
  const navigate = useNavigate();
  const [getUserInfo] = useGetUserInfoMutation();
  const [updateUser] = useUpdateUserMutation();
  const [getNotesByPage] = useGetNotesByPageMutation();
  const [userId, setUserId] = useState<number | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [notesTotal, setNotesTotal] = useState<number | null>(null);
  const { isAuthenticated } = useIsAuthenticated();

  const handleGetUserInfo = useCallback(async () => {
    try {
      const response = await getUserInfo().unwrap();
      setUserId(response.id);
      setUsername(response.username);
      setStatus(response.status);
    } catch {
      toaster.add({
        name: 'get-user-info-error',
        title: 'Не удалось загрузить профиль',
        theme: 'danger',
      });
    }
  }, [getUserInfo]);

  const handleGetNotesTotal = useCallback(async () => {
    try {
      const { total } = await getNotesByPage(1).unwrap();
      setNotesTotal(total);
    } catch {
      toaster.add({
        name: 'get-notes-total-error',
        title: 'Не удалось загрузить количество заметок',
        theme: 'danger',
      });
    }
  }, [getNotesByPage]);

  const handleStatusBlur = useCallback(async () => {
    if (userId === null || status === null) return;
    try {
      await updateUser({ id: userId, username: username ?? '', status }).unwrap();
      toaster.add({
        name: 'update-status-success',
        title: 'Статус обновлён',
        theme: 'success',
      });
    } catch {
      toaster.add({
        name: 'update-status-error',
        title: 'Не удалось сохранить статус',
        theme: 'danger',
      });
    }
  }, [userId, username, status, updateUser]);

  useEffect(() => {
    if (isAuthenticated) {
      handleGetUserInfo();
      handleGetNotesTotal();
    }
  }, [isAuthenticated, handleGetUserInfo, handleGetNotesTotal]);

  return (
    <ContentWrapper
      children={(
        <section id="center">
          <PageMeta title="Профиль" />
          <ProtectedWrapper fallback={<RedirectToLogin />}>
            <div className={style.container}>
              <Text variant="header-2">Profile</Text>
              <TextInput
                label="Email"
                placeholder="Placeholder"
                disabled
                value={username ?? '—'}
              />
              <TextInput
                label="Status"
                placeholder="Введите статус"
                value={status ?? ''}
                onUpdate={setStatus}
                onBlur={handleStatusBlur}
              />
              <TextInput
                label="Notes"
                disabled
                value={notesTotal !== null ? String(notesTotal) : '—'}
              />
              <Button
                view="outlined-action"
                size="m"
                onClick={() => navigate('/admin/types')}
              >
                Управление типами
              </Button>
            </div>
          </ProtectedWrapper>
        </section>
      )}
      sidebar
    />
  );
}

export default ProfilePage;
