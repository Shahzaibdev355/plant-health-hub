import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyEmail from "./pages/VerifyEmail";
import Activate2Fa from "./pages/Activate2Fa";
import VerifyOTP from "./pages/VerifyOTP";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import SavedImages from "./pages/SavedImages";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import OtpRoute from "./routes/OtpRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import Activate2FaRoute from "./routes/Activate2FaRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-email" element={<VerifyEmail />} />


          {/* <Route path="/verify-otp" element={<VerifyOTP />} /> */}

          <Route
            path="/activate-2fa"
            element={
              <Activate2FaRoute>
                <Activate2Fa />
              </Activate2FaRoute>
            }
          />

          <Route
            path="/verify-otp"
            element={
              <OtpRoute>
                <VerifyOTP />
              </OtpRoute>
            }
          />


          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Dashboard Routes */}
          {/* <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/show-images" element={<SavedImages />} />
          </Route> */}


          <Route element={<DashboardLayout />}>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/show-images"
              element={
                <ProtectedRoute>
                  <SavedImages />
                </ProtectedRoute>
              }
            />
          </Route>


          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
