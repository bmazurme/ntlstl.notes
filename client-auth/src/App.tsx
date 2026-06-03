import { Route, Routes } from 'react-router-dom';

import MainPage from './pages/MainPage';
import NotePage from './pages/note-page';
import KitPage from './pages/KitPage';
import ProtectedPage from './pages/ProtectedPage';
import NotFoundPage from './pages/NotFoundPage';
import OauthPage from './pages/OauthPage';
import AddPage from './pages/add-page';
import EditPage from './pages/edit-page';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={(<MainPage page={1} />)} />
        <Route path="/notes" element={(<MainPage />)} />
        <Route
          path="/oauth"
          element={(
            <OauthPage />
          )}
        />
        <Route path="/add-note" element={(<AddPage />)} />
        <Route path="/edit-note/:noteId" element={(<EditPage />)} />
        
        <Route path="/note/:noteId" element={(<NotePage />)} />
        <Route path="/kit" element={(<KitPage />)} />
        <Route path="/profile" element={(<ProtectedPage />)} />
        <Route path="*" element={(<NotFoundPage />)} />
      </Routes>
    </>
  )
}

export default App;
