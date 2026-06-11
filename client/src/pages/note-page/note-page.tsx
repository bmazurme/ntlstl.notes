import { Pencil, TrashBin, ArrowLeft, CircleFill } from '@gravity-ui/icons';
import { Button, Card, Icon, Label, Skeleton, Text } from '@gravity-ui/uikit';
import { useCallback, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import ConfirmDeleteModal from '../../components/confirm-delete-modal';
import ContentWrapper from '../../components/content-wrapper';
import MarkdownPreview from '../../components/markdown-preview/markdown-preview';
import { MARKDOWN_SETTINGS } from '../../components/note/markdown-settings';
import PageMeta from '../../components/page-meta';
import ProtectedWrapper from '../../components/protected-wrapper';
import { toaster } from '../../main';
import { useGetNoteByIdQuery, useDeleteNoteMutation } from '../../store/api/notes-api/endpoints';

import style from './note-page.module.css';

export default function NotePage() {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { data, isLoading } = useGetNoteByIdQuery(+noteId!);
  const [deleteNote, { isLoading: isDeleting }] = useDeleteNoteMutation();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const canGoBack = location.key !== 'default';
  const handleBack = useCallback(() => {
    if (canGoBack) {
      navigate(-1);
    } else {
      navigate('/');
    }
  }, [navigate, canGoBack]);

  const handleDelete = async () => {
    try {
      await deleteNote(+noteId!).unwrap();
      setConfirmOpen(false);
      navigate('/notes');
    } catch {
      toaster.add({
        name: 'delete-note-error',
        title: 'Не удалось удалить заметку',
        theme: 'danger',
      });
      setConfirmOpen(false);
    }
  };

  return (
    <>
      <PageMeta
        title={data?.title ?? 'Заметка'}
        description={data?.preview}
      />
      <ContentWrapper
        children={(
          <Card
            className="blog-post"
            type="container"
            size="l"
          >
            <div className={style.header}>
              <div className={style.navigation}>
                <Button
                  view="flat"
                  size="s"
                  aria-label="Вернуться к списку заметок"
                  onClick={handleBack}
                >
                  <Icon
                    data={ArrowLeft}
                    size={14}
                    aria-hidden="true"
                  />
                  All notes
                </Button>
                <Label
                  className={data?.type ? `type-label-${data.type.id}` : undefined}
                  icon={(
                    <Icon
                      size={14}
                      data={CircleFill}
                      aria-hidden="true"
                    />
                  )}
                >
                  {data?.type?.name}
                </Label>
              </div>
              <ProtectedWrapper>
                <div className={style.tools}>
                  <Button
                    view="outlined-action"
                    size="s"
                    aria-label={`Редактировать заметку: ${data?.title}`}
                    onClick={() => navigate(`/edit-note/${noteId}`)}
                  >
                    <Icon
                      data={Pencil}
                      size={14}
                      aria-hidden="true"
                    />
                    Edit
                  </Button>
                  <Button
                    view="outlined-danger"
                    size="s"
                    aria-label={`Удалить заметку: ${data?.title}`}
                    onClick={() => setConfirmOpen(true)}
                  >
                    <Icon
                      data={TrashBin}
                      size={14}
                      aria-hidden="true"
                    />
                    Delete
                  </Button>
                </div>
              </ProtectedWrapper>
            </div>

            <div
              className="post-title"
              aria-busy={isLoading}
            >
              {isLoading
                ? (
                  <Skeleton
                    className={style.loader}
                    aria-label="Загрузка заголовка"
                  />
                )
                : (
                  <Text variant="header-1">
                    {data?.title}
                  </Text>
                )}
            </div>

            <div
              className="post-excerpt"
              aria-busy={isLoading}
              aria-live="polite"
            >
              {isLoading
                ? (
                  <Skeleton
                    className={style.loaderContent}
                    aria-label="Загрузка содержимого"
                  />
                )
                : (
                  <MarkdownPreview
                    getValue={() => data?.content || ''}
                    {...MARKDOWN_SETTINGS}
                  />
                )}
            </div>
          </Card>
        )}
        sidebar
      />

      <ConfirmDeleteModal
        open={confirmOpen}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setConfirmOpen(false)}
      />
    </>
  );
}
