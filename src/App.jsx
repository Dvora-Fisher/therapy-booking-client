import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import AppointmentsPage from './pages/AppointmentsPage';
import AuthPage from './pages/AuthPage';
import NotFoundPage from './pages/NotFoundPage';
import SlotsPage from './pages/SlotsPage';
import TherapistSlotsPage from './pages/TherapistSlotsPage';
import { ROLES } from './utils/labels';

// "/" sends each role to its own home page
function HomeRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === ROLES.Therapist ? '/therapist/slots' : '/slots'} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/register" element={<AuthPage mode="register" />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/appointments" element={<AppointmentsPage />} />

          <Route element={<ProtectedRoute roles={[ROLES.Client]} />}>
            <Route path="/slots" element={<SlotsPage />} />
          </Route>

          <Route element={<ProtectedRoute roles={[ROLES.Therapist]} />}>
            <Route path="/therapist/slots" element={<TherapistSlotsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
