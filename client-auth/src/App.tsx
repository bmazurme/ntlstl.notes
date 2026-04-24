import { Route, Routes } from 'react-router-dom';

import MainPage from './pages/MainPage';
import KitPage from './pages/KitPage';
import ProtectedPage from './pages/ProtectedPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={(<MainPage />)} />
        <Route path="/kit" element={(<KitPage />)} />
        <Route path="protected" element={(<ProtectedPage />)} />
        <Route path="*" element={(<NotFoundPage />)} />
      </Routes>
    </>
  )
}

export default App;
