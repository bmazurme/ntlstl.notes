import React from 'react';
import { useMarkdownEditor, MarkdownEditorView, type MarkupString } from '@gravity-ui/markdown-editor';

export interface EditorProps {
  onSubmit: (value: MarkupString) => void;
};

export const Editor: React.FC<EditorProps> = ({onSubmit}) => {
  const editor = useMarkdownEditor({
    md: {
      html: false,
    },
  });

  React.useEffect(() => {
    function submitHandler() {
      // Serialize current content to markdown markup
      const value = editor.getValue();
      onSubmit(value);
    }

    editor.on('submit', submitHandler);
    return () => {
      editor.off('submit', submitHandler);
    };
  }, [onSubmit]);

  return <MarkdownEditorView stickyToolbar autofocus editor={editor} />;
};
