import {unstable_HistoryRouter as HistoryRouter, Routes, Route, Navigate} from 'react-router-dom'
import { history } from './router';
import LoginPage from './pages/LoginPage.tsx'
import { UserDatasetsPage } from './pages/UserDatasetsPage.tsx'
import { DatasetPage } from './pages/DatasetPage.tsx'
import Error404Page from './pages/Error404Page.tsx'
import Layout from './layout.tsx'
import HomePage from './pages/HomePage.tsx'
import { UserClassificationsPage } from './pages/UserClassificationsPage.tsx'
import { UserModelsPage } from './pages/UserModelsPage.tsx'
import { AccountPage } from './pages/AccountPage.tsx'
import LogoutPage from './pages/LogoutPage.tsx'
import { ClassificationPage } from './pages/ClassificationPage.tsx';


function App() {
  return (
    <HistoryRouter history={history}>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<HomePage/>} />
        <Route path="/datasets/:username" element={<Layout><UserDatasetsPage/></Layout>} />
        <Route path="/dataset/:dataset_id" element={<Layout><DatasetPage/></Layout>}/>
        <Route path="/models/:username" element={<Layout><UserModelsPage/></Layout>} />
        <Route path="/classifications/:username" element={<Layout><UserClassificationsPage/></Layout>} />
        <Route path="/classification/:classification_id" element={<Layout><ClassificationPage/></Layout>} />
        <Route path="/account" element={<Layout><AccountPage/></Layout>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/logout" element={<LogoutPage/>} />
        <Route path='/404' element={<Error404Page/>} />
        <Route path='*' element={<Navigate to="/404" replace/>}/>
      </Routes>
    </HistoryRouter>
  )
}

export default App