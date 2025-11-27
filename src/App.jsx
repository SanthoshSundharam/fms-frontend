// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import UserDashboard from './components/User/UserDashboard';
import AdminDashboard from './components/Admin/AdminDashboard'; // ✅ import it

function App() {
  return (
    <>
      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User dashboard (protected) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin dashboard (protected + adminOnly) */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />   {/* ✅ use real component */}
            </ProtectedRoute>
          }
        />

        {/* 404 fallback */}
        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
    </>
  );
}

export default App;
