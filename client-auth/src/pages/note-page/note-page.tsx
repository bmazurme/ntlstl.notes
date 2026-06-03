import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Label, Modal, Skeleton, Text } from '@gravity-ui/uikit';

import ContentWrapper from '../../components/ContentWrapper';
import { useGetNoteByIdQuery, useDeleteNoteMutation } from '../../store/api/notes-api/endpoints';
import MarkdownPreview from '../../components/MarkdownPreview/MarkdownPreview';
import { MARKDOWN_SETTINGS } from '../../components/note/markdown-settings';

export default function NotePage() {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useGetNoteByIdQuery(+noteId!);
  const [deleteNote, { isLoading: isDeleting }] = useDeleteNoteMutation();
  const [confirmOpen, setConfirmOpen] = useState(false);

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
            view="filled"
            type="container"
            size="l"
          >
            <div className="post-title">
              {isLoading
                ? <Skeleton className="loader" />
                : <Text variant="header-2">
                    {data?.title}
                  </Text>}
            </div>
            <Button
              view="outlined-action"
              size="s"
              onClick={() => navigate(`/edit-note/${noteId}`)}
            >
              Edit Page
            </Button>
            <Button
              view="outlined-danger"
              size="s"
              onClick={() => setConfirmOpen(true)}
            >
              Delete Page
            </Button>
            <div className="post-excerpt">
              {isLoading
                ? <Skeleton className="loader-content" />
                : <MarkdownPreview
                    getValue={() => data?.content || ''}
                    {...MARKDOWN_SETTINGS}
                  />}
            </div>
            {isLoading
              ? <Skeleton className="loader-content" />
              : <Label
                  className="post-meta"
                  theme="normal"
                  size="m"
                >
                  {data?.type?.name}
                </Label>}
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
