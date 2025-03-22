import LoginPage from './pages/LoginPage'
import ChatPage from './pages/ChatPage'
import { Route, Routes} from 'react-router-dom'
import { ThemeProvider } from './context/theme-provider'


const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes>
        <Route path="/" element={<ChatPage/>} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App