import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import {VisualizationPage} from './pages/VisualizationPage.tsx'
import LoginPage from './pages/LoginPage.tsx'
import { UserPage } from './pages/UserPage.tsx'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/user/:username" element={<UserPage/>} />
        <Route path="/login" element={<LoginPage/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App