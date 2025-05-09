import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import {VisualizationPage} from './pages/VisualizationPage.tsx'
import LoginPage from './pages/LoginPage.tsx'
import { UserPage } from './pages/UserPage.tsx'
import { DatasetPage } from './pages/DatasetPage.tsx'
import Error404Page from './pages/Error404Page.tsx'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/user/:username" element={<UserPage/>} />
        <Route path="/dataset/:dataset_id" element={<DatasetPage/>}/>
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/visualization" element={<VisualizationPage/>} />
        <Route path='/404' element={<Error404Page/>} />
        <Route path='*' element={<Navigate to="/404" replace/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App