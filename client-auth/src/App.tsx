import { Route, Routes } from 'react-router-dom';

import MainPage from './pages/MainPage';
import PostPage from './pages/PostPage';
import KitPage from './pages/KitPage';
import ProtectedPage from './pages/ProtectedPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={(<MainPage page={1} />)} />
        <Route path="/notes" element={(<MainPage />)} />
        {/* <Route path="/notes" element={<Navigate to="/" replace />} /> */}
        <Route path="/note/:noteId" element={(<PostPage />)} />
        <Route path="/kit" element={(<KitPage />)} />
        <Route path="/profile" element={(<ProtectedPage />)} />
        <Route path="*" element={(<NotFoundPage />)} />
      </Routes>
    </>
  )
}

export default App;
