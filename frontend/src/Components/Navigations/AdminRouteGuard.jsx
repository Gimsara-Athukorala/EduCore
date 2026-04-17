import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAdminAuthenticated } from '../../utils/adminAuth';

function AdminRouteGuard({ children }) {
  if (!isAdminAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default AdminRouteGuard;
