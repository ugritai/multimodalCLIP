import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import {VisualizationPage} from './pages/VisualizationPage.tsx'
import LoginPage from './pages/LoginPage.tsx'
import { UserDatasetsPage } from './pages/UserDatasetsPage.tsx'
import { DatasetPage } from './pages/DatasetPage.tsx'
import Error404Page from './pages/Error404Page.tsx'
import Layout from './layout.tsx'
import HomePage from './pages/HomePage.tsx'
import { UserClassificationsPage } from './pages/UserClassificationsPage.tsx'
import { UserModelsPage } from './pages/UserModelsPage.tsx'
import { AccountPage } from './pages/AccountPage.tsx'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<HomePage/>} />
        <Route path="/datasets/:username" element={<Layout><UserDatasetsPage/></Layout>} />
        <Route path="/dataset/:dataset_id" element={<Layout><DatasetPage/></Layout>}/>
        <Route path="/models/:username" element={<Layout><UserModelsPage/></Layout>} />
        <Route path="/classifications/:username" element={<Layout><UserClassificationsPage/></Layout>} />
        <Route path="/account" element={<Layout><AccountPage/></Layout>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/visualization" element={<VisualizationPage/>} />
        <Route path='/404' element={<Error404Page/>} />
        <Route path='*' element={<Navigate to="/404" replace/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App