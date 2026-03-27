import { ThemeProvider, Toaster, ToasterComponent, ToasterProvider } from '@gravity-ui/uikit';
import type { MarkupString } from '@gravity-ui/markdown-editor';

import { Editor } from './Editor';
import MarkdownPreview from './MarkdownPreview';
import { useState } from 'react';

const App: React.FC = () => {
  const [value, setValue] = useState('');
  const toaster = new Toaster();
  const handleSubmit = (value: MarkupString) => {
    console.log('Отправленное значение:', value);
    setValue(value);
  };

  return (
    <ThemeProvider theme="light">
      <ToasterProvider toaster={toaster}>
        <ToasterComponent />

        <Editor onSubmit={handleSubmit} />
        <MarkdownPreview
          getValue={() => value}
          allowHTML={false}
          breaks={true}
          linkify={true}
        />
      </ToasterProvider>
    </ThemeProvider>
  );
};

export default App;
