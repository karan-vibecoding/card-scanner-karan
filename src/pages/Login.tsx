import { Navigate } from 'react-router-dom';

// /login now redirects to / which handles smart routing
export default function Login() {
  return <Navigate to="/" replace />;
}
