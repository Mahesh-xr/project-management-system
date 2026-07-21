import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

// ProtectedRoute Wrapper:
// Checks if the user is authenticated. If not, redirects them to /login.
export default function ProtectedRoute({ children }) {
  const { token, loading } = useContext(AuthContext);

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
