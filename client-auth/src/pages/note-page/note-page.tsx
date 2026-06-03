import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Label, Skeleton, Text } from '@gravity-ui/uikit';

import ContentWrapper from '../../components/ContentWrapper';
import { useGetNoteByIdQuery } from '../../store/api/notes-api/endpoints';
import MarkdownPreview from '../../components/MarkdownPreview/MarkdownPreview';
import { MARKDOWN_SETTINGS } from '../../components/note/markdown-settings';

export default function NotePage() {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useGetNoteByIdQuery(+noteId!);

  return (
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
            view="outlined-action"
            size="s"
            // onClick={() => navigate(`/edit-note/${noteId}`)}
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
  )
}
