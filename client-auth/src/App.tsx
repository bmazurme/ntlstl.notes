import { Route, Routes } from 'react-router-dom';

import AddPage from './pages/add-page';
import EditPage from './pages/edit-page';
import MainPage from './pages/main-page';
import NotFoundPage from './pages/not-found-page';
import NotePage from './pages/note-page';
import OauthPage from './pages/oauth-page';
import OauthErrorPage from './pages/oauth-error-page/oauth-error-page';
import ProfilePage from './pages/profile-page';
import TypeNotesPage from './pages/type-notes-page';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={(<MainPage page={1} />)} />
        <Route path="/notes" element={(<MainPage />)} />
        <Route path="/oauth" element={(<OauthPage />)} />
        <Route path="/oauth-error" element={(<OauthErrorPage />)} />
        <Route path="/add-note" element={(<AddPage />)} />
        <Route path="/edit-note/:noteId" element={(<EditPage />)} />
        <Route path="/note/:noteId" element={(<NotePage />)} />
        <Route path="/notes/type/:typeId" element={(<TypeNotesPage />)} />
        <Route path="/profile" element={(<ProfilePage />)} />
        <Route path="*" element={(<NotFoundPage />)} />
      </Routes>
    </>
  )
}

export default App;
