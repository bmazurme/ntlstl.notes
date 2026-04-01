import { Icon, ThemeProvider, Toaster, ToasterComponent, ToasterProvider } from '@gravity-ui/uikit';
import type { MarkupString } from '@gravity-ui/markdown-editor';

import { Editor } from './Editor';
import MarkdownPreview from './MarkdownPreview';
import { useState } from 'react';

import { Button, TextInput, Card, Text } from '@gravity-ui/uikit';
import { Gear, Sun, Moon } from '@gravity-ui/icons';

import style from './App.module.css';

const App: React.FC = () => {
  const [value, setValue] = useState('');
  const [theme, setTheme] = useState('dark');
  const toaster = new Toaster();
  const handleSubmit = (value: MarkupString) => {
    console.log('Отправленное значение:', value);
    setValue(value);
  };

  return (
    <ThemeProvider theme={theme}>
      <ToasterProvider toaster={toaster}>
        <ToasterComponent />
        <div className={style.container}>
          <Button view="outlined" size="l" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            <Icon data={theme === 'dark' ? Sun : Moon} size={18} />
          </Button>
          <Text variant="header-2">Notes</Text>
          <div className={style.form}>
            <TextInput placeholder="Title" size="l" />
            <TextInput placeholder="Tag" size="l" />
            <Editor onSubmit={handleSubmit} />
          </div>
        </div>



        <Card theme="normal" size="l" className={style.preview}>
          {/* <Text variant="header-2">some text</Text> */}
          <MarkdownPreview
            getValue={() => value}
            allowHTML={true}
            breaks={true}
            linkify={true}
          />
        </Card>

      </ToasterProvider>
    </ThemeProvider>
  );
};

export default App;
