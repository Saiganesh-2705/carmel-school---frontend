import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import RoleDashboard from './dashboards/RoleDashboard';
import PublicLayout from './layouts/PublicLayout';
import Home from './pages/Home';
import About from './pages/About';
import Events from './pages/Events';
import Classes from './pages/Classes';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import UserManagement from './pages/UserManagement';
import Notices from './pages/Notices';
import Messages from './pages/Messages';
import PublicNotices from './pages/PublicNotices';

const ROLE_AREAS = ['admin', 'teacher', 'student', 'parent', 'accountant', 'librarian'];

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/classes" element={<Classes />} />
        <Route path="/events" element={<Events />} />
        <Route path="/notices" element={<PublicNotices />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      {ROLE_AREAS.map((role) => (
        <Route key={role} element={<ProtectedRoute roles={[role]} />}>
          <Route path={`/${role}`} element={<DashboardLayout />}>
            <Route index element={<RoleDashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="notices" element={<Notices />} />
            {role === 'admin' && <Route path="users" element={<UserManagement />} />}
            {role === 'admin' && <Route path="messages" element={<Messages />} />}
          </Route>
        </Route>
      ))}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
