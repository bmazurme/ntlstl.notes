import { useNavigate } from 'react-router-dom';
import { Card, Label, Text } from '@gravity-ui/uikit';

import MarkdownPreview from '../markdown-preview/markdown-preview';
import { MARKDOWN_SETTINGS } from './markdown-settings';
import type { NoteProps } from './note.props';

export default function Note({ note }: NoteProps) {
  const navigate = useNavigate();

  return (
    <Card
      className="blog-post"
      theme="normal"
      // view="filled"
      // type="action"
      type="selection"
      size="l"
      onClick={() => navigate(`/note/${note.id}`)}
    >
      <div className="post-title">
        <Text variant="header-1">
          {note.title}
        </Text>
        <Label
          theme="normal"
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
