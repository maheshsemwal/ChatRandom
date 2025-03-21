import LoginPage from './pages/LoginPage'
import LandingPage from './pages/LandingPage'
import { Route, Routes} from 'react-router-dom'


const App = () => {
  return (
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
  )
}

export default App