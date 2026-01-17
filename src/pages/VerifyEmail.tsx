import { Link } from "react-router-dom";
import { Leaf, Mail, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const VerifyEmail = () => {
  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-card rounded-2xl border border-border shadow-card p-8 text-center">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Leaf className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground">
              PlantGuard
            </span>
          </div>

          {/* Icon */}
          <div className="w-20 h-20 rounded-full bg-accent mx-auto mb-6 flex items-center justify-center">
            <Mail className="w-10 h-10 text-primary" />
          </div>

          <h1 className="text-2xl font-semibold text-foreground mb-3">
            Verify Your Email
          </h1>
          <p className="text-muted-foreground mb-8">
            We've sent a verification link to your email address. Please check
            your inbox and click the link to activate your account.
          </p>

          {/* Success Indicator */}
          <div className="bg-accent/50 rounded-xl p-4 mb-8">
            <div className="flex items-center gap-3 justify-center">
              <CheckCircle className="w-5 h-5 text-primary" />
              <span className="text-sm text-foreground">
                Verification email sent successfully
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Didn't receive the email? Check your spam folder or
            </p>
            <Button variant="outline" className="w-full">
              Resend Verification Email
            </Button>
          </div>

          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground mb-4">
              Already verified?
            </p>
            <Button asChild className="w-full">
              <Link to="/login">Continue to Login</Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
