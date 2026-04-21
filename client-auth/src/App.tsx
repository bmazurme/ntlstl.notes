import { Route, Routes } from 'react-router-dom';

import MainPage from './pages/MainPage';
import KitPage from './pages/KitPage';
import NotFoundPage from './pages/NotFoundPage';

import './App.css';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={(<MainPage />)} />
        <Route path="/kit" element={(<KitPage />)} />
        <Route path="*" element={(<NotFoundPage />)} />
      </Routes>
    </>
  )
}

export default App;
