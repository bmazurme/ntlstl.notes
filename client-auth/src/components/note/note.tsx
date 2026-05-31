import { useNavigate } from 'react-router-dom';
import { Button, Card, Label, Text } from '@gravity-ui/uikit';

import MarkdownPreview from '../MarkdownPreview/MarkdownPreview';
import { MARKDOWN_SETTINGS } from './markdown-settings';
import type { NoteProps } from './note.props';

export default function Note({ note }: NoteProps) {
  const navigate = useNavigate();

  return (
    <Card
      className="blog-post"
      view="filled"
      type="container"
      size="l"
    >
      <div className="post-title">
        <Text variant="header-2">
          {note.title}
        </Text>
      </div>
      <Label
        className="post-meta"
        theme="normal"
        size="m"
      >
        {note.type.name}
      </Label>
      <div className="post-content">
        <MarkdownPreview
          getValue={() => note?.preview || ''}
          {...MARKDOWN_SETTINGS}
        />
      </div>
      <div className="read-more">
        <Button
          view="outlined-action"
          size="m"
          onClick={() => navigate(`/note/${note.id}`)}
        >
          read-more
        </Button>
      </div>
    </Card>
  )
}
