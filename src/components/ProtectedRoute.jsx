import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles, rol }) => {
  const token = localStorage.getItem('token');

  if (!token || !allowedRoles.includes(rol)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
