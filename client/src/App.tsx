import { useState } from 'react';
import {
  ThemeProvider, Toaster, ToasterComponent, ToasterProvider,
} from '@gravity-ui/uikit';

import MainPage from './pages/MainPage/MainPage';
import EditorPage from './pages/EditorPage/EditorPage';
import NotePage from './pages/NotePage/NotePage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';

import { BrowserRouter, Route, Routes } from 'react-router-dom';



const App: React.FC = () => {
  const [theme, setTheme] = useState('dark');
  const toaster = new Toaster();

  const [value, setValue] = useState('');
  const [labels, setLabels] = useState(['label1', 'label2', 'label3']);
  const [title, setTitle] = useState('');

  const handleSubmit = (value: MarkupString) => {
    console.log('Отправленное значение:', value);
    setLabels(labels);
    setValue(value);
  };

  return (
    <ThemeProvider theme={theme}>
      <ToasterProvider toaster={toaster}>
        <ToasterComponent />

        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={(
                <MainPage
                  setTheme={setTheme}
                  theme={theme}
                />
              )}
            />
            <Route
              path="/editor"
              element={(
                <EditorPage
                  setTheme={setTheme}
                  theme={theme}
                  setTitle={setTitle}
                  title={title}
                  handleSubmit={handleSubmit}
                />
              )}
            />
            <Route
              path="/note"
              element={(
                <NotePage
                  setTheme={setTheme}
                  theme={theme}
                  title={title}
                  value={value}
                  labels={labels}
                />
              )}
            />
            <Route
              path="*"
              element={(
                <NotFoundPage
                  setTheme={setTheme}
                  theme={theme}
                />
              )}
            />

          </Routes>
        </BrowserRouter>

      </ToasterProvider>
    </ThemeProvider>
  );
};

export default App;
