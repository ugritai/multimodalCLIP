import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import {VisualizationPage} from './pages/VisualizationPage.tsx'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/visualization" />} />
        <Route path="/visualization" element={<VisualizationPage/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App