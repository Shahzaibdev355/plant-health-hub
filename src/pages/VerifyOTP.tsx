import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, ArrowLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";


import { useAuthStore } from "@/store/auth-store";
import axios from "@/api/axios";


const VerifyOTP = () => {

  const { userId, accessToken, twoFactorEnabled, setOtpVerified, setLogin, qrDataUrl } = useAuthStore();



  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(45);


  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev <= 0 ? 45 : prev - 1));
    }, 1000);
  
    return () => clearInterval(timer);
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    try {
      setIsSubmitting(true);

      // Debug: Check if we have the token
      const storedToken = localStorage.getItem('accessToken') || accessToken;
      // console.log('Token being used:', storedToken);
      // console.log('User ID:', userId);

      // Try the request
      const res = await axios.post("/auth/verify-2fa", { 
        totp: otp 
      });

      const { accessToken: newToken, userId: newUserId } = res.data.data;

      // Store the new token
      if (newToken) {
        localStorage.setItem('accessToken', newToken);
      }

      // OTP verified → full login
      setLogin(newToken, newUserId || userId, true);
      setOtpVerified();

      toast.success("OTP verified successfully!");
      navigate("/dashboard");
    } catch (err: unknown) {
      const error = err as { response?: { status?: number; data?: { message?: string; error?: string } } };
      console.error('2FA verification error:', error.response?.data);
      console.error('Full error:', err);
      
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        navigate("/login");
      } else {
        toast.error(error.response?.data?.message || error.response?.data?.error || "Invalid OTP");
      }
    } finally {
      setIsSubmitting(false);
    }
  };


  // Sample authenticator secret for QR code (in production, this would come from the backend)
  const authenticatorSecret = "JBSWY3DPEHPK3PXP";
  const otpauthUrl = `otpauth://totp/PlantGuard:user@example.com?secret=${authenticatorSecret}&issuer=PlantGuard`;

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Back Link */}
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>

        {/* Card */}
        <div className="bg-card rounded-2xl border border-border shadow-card p-8">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Leaf className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground">
              PlantGuard
            </span>
          </div>

          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="w-7 h-7 text-primary" />
            </div>
          </div>

          <h1 className="text-2xl font-semibold text-foreground text-center mb-2">
            Two-Factor Authentication
          </h1>
          {/* <p className="text-muted-foreground text-center mb-6 text-sm">
            Scan the QR code with your authenticator app and enter the verification code
          </p> */}

          <p className="text-muted-foreground text-center mb-6 text-sm">
            {twoFactorEnabled
              ? "2FA already enabled. Check your authenticator app and enter the verification code."
              : "Scan the QR code with your authenticator app and enter the verification code"}
          </p>

          {/* QR Code */}
          {/* <div className="flex justify-center mb-6">
            <div className="p-4 bg-white rounded-xl border border-border shadow-sm">
              <QRCodeSVG
                value={otpauthUrl}
                size={160}
                level="H"
                includeMargin={false}
                bgColor="#FFFFFF"
                fgColor="#1a1a1a"
              />
            </div>
          </div> */}


          {/* {!twoFactorEnabled && (
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white rounded-xl border border-border shadow-sm">
                <QRCodeSVG
                  value={otpauthUrl}
                  size={160}
                  level="H"
                  includeMargin={false}
                  bgColor="#FFFFFF"
                  fgColor="#1a1a1a"
                />
              </div>
            </div>
          )} */}


          {!twoFactorEnabled && qrDataUrl && (
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white rounded-xl border border-border shadow-sm">
                <img src={qrDataUrl} alt="2FA QR Code" className="w-40 h-40" />
              </div>
            </div>
          )}


          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Input */}
            <div className="flex flex-col items-center gap-4">
              <label className="text-sm font-medium text-foreground">
                Enter verification code
              </label>
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
              >
                <InputOTPGroup className="gap-2">
                  <InputOTPSlot
                    index={0}
                    className="w-12 h-14 text-lg font-semibold rounded-lg border-border bg-background"
                  />
                  <InputOTPSlot
                    index={1}
                    className="w-12 h-14 text-lg font-semibold rounded-lg border-border bg-background"
                  />
                  <InputOTPSlot
                    index={2}
                    className="w-12 h-14 text-lg font-semibold rounded-lg border-border bg-background"
                  />
                  <InputOTPSlot
                    index={3}
                    className="w-12 h-14 text-lg font-semibold rounded-lg border-border bg-background"
                  />
                  <InputOTPSlot
                    index={4}
                    className="w-12 h-14 text-lg font-semibold rounded-lg border-border bg-background"
                  />
                  <InputOTPSlot
                    index={5}
                    className="w-12 h-14 text-lg font-semibold rounded-lg border-border bg-background"
                  />
                </InputOTPGroup>
              </InputOTP>
            </div>

            {/* Countdown Timer */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <span
                  className={`text-2xl font-bold ${countdown <= 10 ? 'text-destructive' : 'text-primary'
                    }`}
                >
                  {countdown}s
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Code will expire in {countdown} seconds. Check your authenticator app again.
              </p>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting || otp.length !== 6}
              className="w-full"
            >
              {isSubmitting ? "Verifying..." : "Verify OTP"}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyOTP;
