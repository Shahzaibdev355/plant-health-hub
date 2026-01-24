import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/auth-store";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { otpVerified } = useAuthStore();

  if (!otpVerified) {
    return <Navigate to="/login" replace />;
  }
  

  return children;
};

export default ProtectedRoute;
