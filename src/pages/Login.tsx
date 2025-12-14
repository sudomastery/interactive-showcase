import { LoginForm } from '@/components/auth/LoginForm';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function Login() {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated && user) {
    return <Navigate to={user.role === 'administrator' ? '/dashboard' : '/verify'} replace />;
  }

  return <LoginForm />;
}
