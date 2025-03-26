import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import {VisualizationPage} from './pages/VisualizationPage.tsx'
import LoginPage from './pages/LoginPage.tsx'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/visualization" element={<VisualizationPage/>} />
        <Route path="/login" element={<LoginPage/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App