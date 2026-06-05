import { useCallback, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Icon, Label, Skeleton, Text } from '@gravity-ui/uikit';
import { Pencil, TrashBin, ArrowLeft, CircleFill } from '@gravity-ui/icons';

import ContentWrapper from '../../components/content-wrapper';
import ProtectedWrapper from '../../components/protected-wrapper';
import ConfirmDeleteModal from '../../components/confirm-delete-modal';
import { toaster } from '../../main';
import { useGetNoteByIdQuery, useDeleteNoteMutation } from '../../store/api/notes-api/endpoints';
import MarkdownPreview from '../../components/markdown-preview/markdown-preview';
import { MARKDOWN_SETTINGS } from '../../components/note/markdown-settings';

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
      toaster.add({ name: 'delete-note-error', title: 'Не удалось удалить заметку', theme: 'danger' });
      setConfirmOpen(false);
    }
  };

  return (
    <>
      <ContentWrapper
        children={(
          <Card
            className="blog-post"
            // view="filled"
            type="container"
            size="l"
          >
            <div className={style.header}>
              <div className={style.navigation}>
                <Button
                  view="flat"
                  size="s"
                  onClick={handleBack}
                >
                  <Icon data={ArrowLeft} size={14} />
                  All notes
                </Button>
                <Label icon={<Icon size={14} data={CircleFill} />}>{data?.type?.name}</Label>
              </div>
              <ProtectedWrapper>
                <div className={style.tools}>
                  <Button
                    view="outlined-action"
                    size="s"
                    onClick={() => navigate(`/edit-note/${noteId}`)}
                  >
                    <Icon data={Pencil} size={14} />
                    Edit
                  </Button>
                  <Button
                    view="outlined-danger"
                    size="s"
                    onClick={() => setConfirmOpen(true)}
                  >
                    <Icon data={TrashBin} size={14} />
                    Delete
                  </Button>
                </div>
              </ProtectedWrapper>
            </div>
            <div className="post-title">
              {isLoading
                ? <Skeleton className="loader" />
                : <Text variant="header-1">
                    {data?.title}
                  </Text>}
            </div>

            <div className="post-excerpt">
              {isLoading
                ? <Skeleton className="loader-content" />
                : <MarkdownPreview
                    getValue={() => data?.content || ''}
                    {...MARKDOWN_SETTINGS}
                  />}
            </div>
            </Card>)}
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
