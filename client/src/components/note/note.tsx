import { Card, Label, Text } from '@gravity-ui/uikit';
import { useNavigate } from 'react-router-dom';

import MarkdownPreview from '../markdown-preview/markdown-preview';

import { MARKDOWN_SETTINGS } from './markdown-settings';
import type { NoteProps } from './note.props';

export default function Note({ note }: NoteProps) {
  const navigate = useNavigate();

  return (
    <Card
      className="blog-post"
      theme="normal"
      type="selection"
      size="l"
      role="link"
      tabIndex={0}
      aria-label={`Открыть заметку: ${note.title}`}
      onClick={() => navigate(`/note/${note.id}`)}
    >
      <div className="post-title">
        <Text variant="header-1">
          {note.title}
        </Text>
        <Label
          theme="success"
          size="s"
        >
          {note.type.name}
        </Label>
      </div>

      <div className="post-content">
        <MarkdownPreview
          getValue={() => note?.preview || ''}
          {...MARKDOWN_SETTINGS}
        />
      </div>
    </Card>
  )
}
