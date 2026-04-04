import { useState } from 'react';
import {
  Icon, ThemeProvider, Toaster, ToasterComponent, ToasterProvider, Button, TextInput, Text, Pagination,
  type PaginationProps, 
} from '@gravity-ui/uikit';
import type { MarkupString } from '@gravity-ui/markdown-editor';
import { Sun, Moon } from '@gravity-ui/icons';

import { Editor } from './Editor';
import Note from './Note';

import style from './App.module.css';

const App: React.FC = () => {
  const [state, setState] = useState({ page: 1, pageSize: 100 });
  const [value, setValue] = useState('');
  const [theme, setTheme] = useState('dark');
  const toaster = new Toaster();

  const handleSubmit = (value: MarkupString) => {
    console.log('Отправленное значение:', value);
    setValue(value);
  };
  const handleUpdate: PaginationProps['onUpdate'] = (page, pageSize) =>
    setState((prevState) => ({ ...prevState, page, pageSize }));

  return (
    <ThemeProvider theme={theme}>
      <ToasterProvider toaster={toaster}>
        <ToasterComponent />

        <div className={style.container}>
          <div className={style.header}>
            <Text variant="header-2">Notes</Text>
            <Button
              view="outlined"
              size="l"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <Icon
                data={theme === 'dark' ? Sun : Moon}
                size={18}
              />
            </Button>
          </div>

          <div className={style.form}>
            <TextInput placeholder="Title" size="l" />
            <TextInput placeholder="Tag" size="l" />
            <Editor onSubmit={handleSubmit} />
          </div>
          <Note value={value} />
          <Pagination
            page={state.page}
            pageSize={state.pageSize}
            total={10000}
            onUpdate={handleUpdate}
          />
        </div>

        {/* <Note value={value} /> */}
      </ToasterProvider>
    </ThemeProvider>
  );
};

export default App;
