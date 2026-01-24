import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/auth-store";

const OtpRoute = ({ children }: { children: JSX.Element }) => {
  const { isLoggedIn, otpVerified } = useAuthStore();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (otpVerified) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default OtpRoute;
