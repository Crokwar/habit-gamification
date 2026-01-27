import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import { AuthProvider } from './context/AuthContext';
import Habits from './pages/Habits';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/Login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/habits" element={<Habits />} />

          <Route path="*" element={<Navigate to="/login" replace/>}/>
        </Routes>
      
      </Router>
    </AuthProvider>
  )
}

export default App;
