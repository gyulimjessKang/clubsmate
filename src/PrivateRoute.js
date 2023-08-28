// PrivateRoute.js
import React, { useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthProvider';

const PrivateRoute = ({ children }) => {
  const { currentUser, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!currentUser || (location.pathname === '/admin' && !isAdmin)) {
      // 로그인하지 않은 사용자 또는 관리자가 아닌 사용자가 보호된 경로에 접근하려고 하면 로그인 페이지로 이동
      navigate('/login', { replace: true, state: { from: location } });
    }
  }, [currentUser, isAdmin, navigate, location]);

  return currentUser ? children : null;
};

export default PrivateRoute;
