import { useCallback, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Icon, Label, Modal, Skeleton, Text } from '@gravity-ui/uikit';
import { Pencil, TrashBin, ArrowLeft, CircleFill } from '@gravity-ui/icons';

import ContentWrapper from '../../components/ContentWrapper';
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
    await deleteNote(+noteId!);
    setConfirmOpen(false);
    navigate('/notes');
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
              <div>
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

      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', minWidth: '320px' }}>
          <Text variant="header-1">Удалить заметку?</Text>
          <Text>Это действие нельзя отменить.</Text>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <Button
              view="normal"
              size="m"
              onClick={() => setConfirmOpen(false)}
              disabled={isDeleting}
            >
              Отмена
            </Button>
            <Button
              view="outlined-danger"
              size="m"
              onClick={handleDelete}
              loading={isDeleting}
            >
              Удалить
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
