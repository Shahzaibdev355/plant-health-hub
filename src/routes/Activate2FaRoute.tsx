import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth-store";

const Activate2FaRoute = ({ children }: { children: JSX.Element }) => {
  const { isLoggedIn, twoFactorEnabled } = useAuthStore();

  // must be logged in
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // if already activated, no need to be here
  if (twoFactorEnabled) {
    return <Navigate to="/verify-otp" replace />;
  }

  return children;
};



export default Activate2FaRoute;
