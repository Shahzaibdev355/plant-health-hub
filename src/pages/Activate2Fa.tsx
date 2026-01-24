import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Leaf, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { toast } from "sonner";

import api from "@/api/axios";
import { useAuthStore } from "@/store/auth-store";


const Activate2Fa = () => {

  
  const { accessToken, setQrDataUrl } = useAuthStore();

  const navigate = useNavigate();

  const handleActivate2FA = async () => {
    try {
      const res = await api.post(
        "/auth/activate-2fa",
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const { qrDataUrl, recoveryCodes } = res.data.data;

      // 🔽 Download recovery codes as .txt
      const blob = new Blob([recoveryCodes.join("\n")], {
        type: "text/plain",
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "plantguard-recovery-codes.txt";
      a.click();
      window.URL.revokeObjectURL(url);

      // Store QR for verify page
      setQrDataUrl(qrDataUrl);

      toast.success("2FA activated. Save your recovery codes!");
      navigate("/verify-otp");
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to activate 2FA");
    }
  };





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
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Card */}
        <div className="bg-card rounded-2xl border border-border shadow-card p-8">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Leaf className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground">
              PlantGuard
            </span>
          </div>

          <h1 className="text-2xl font-semibold text-foreground text-center mb-2">
            Welcome Back
          </h1>
          <p className="text-muted-foreground text-center mb-8">
            Activate 2FA to enhance your account security.
          </p>


          {/* <Button
              type="submit"
              size="lg"
              className="w-full"
            >
              {"Activate 2FA"}
            </Button> */}

          <Button
            size="lg"
            className="w-full"
            onClick={handleActivate2FA}
          >
            Activate 2FA
          </Button>




        </div>
      </motion.div>
    </div>
  );
};

export default Activate2Fa;
