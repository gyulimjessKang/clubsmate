// PrivateRoute.js
import { useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthProvider';

const PrivateRoute = ({ children }) => {
  const { currentUser, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!currentUser || (location.pathname === '/admin' && !isAdmin)) {
      // When a non-logged in user or non-admin user attempts to access a protected path, they are taken to the login page.
      navigate('/login', { replace: true, state: { from: location } });
    }
  }, [currentUser, isAdmin, navigate, location]);

  return currentUser ? children : null;
};

export default PrivateRoute;
