import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import { AuthProvider } from './context/AuthContext';
import Habits from './pages/Habits';
import { ProtectedRoute } from './components/common/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard /> 
            </ProtectedRoute>
          }/>
          <Route path="/habits" element={
            <ProtectedRoute>
              <Habits />
            </ProtectedRoute>
          }/>

          <Route path="*" element={<Navigate to="/login" replace/>}/>
        </Routes>
      
      </Router>
    </AuthProvider>
  )
}

export default App;
