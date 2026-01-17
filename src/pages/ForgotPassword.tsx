import { useState } from "react";
import { Link } from "react-router-dom";
import { Leaf, ArrowLeft, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("Password reset email sent!");
    setIsEmailSent(true);
    setIsSubmitting(false);
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
          to="/login"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
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

          {!isEmailSent ? (
            <>
              <h1 className="text-2xl font-semibold text-foreground text-center mb-2">
                Forgot Password?
              </h1>
              <p className="text-muted-foreground text-center mb-8">
                No worries! Enter your email address and we'll send you a link to
                reset your password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    required
                    className="h-11"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center">
              {/* Success Icon */}
              <div className="w-16 h-16 rounded-full bg-accent mx-auto mb-6 flex items-center justify-center">
                <Mail className="w-8 h-8 text-primary" />
              </div>

              <h1 className="text-2xl font-semibold text-foreground mb-3">
                Check Your Email
              </h1>
              <p className="text-muted-foreground mb-8">
                We've sent a password reset link to{" "}
                <span className="text-foreground font-medium">{email}</span>
              </p>

              <div className="space-y-4">
                <Button
                  variant="outline"
                  onClick={() => setIsEmailSent(false)}
                  className="w-full"
                >
                  Try another email
                </Button>
                <Button asChild className="w-full">
                  <Link to="/login">
                    Back to Login
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          )}

          <p className="text-center text-sm text-muted-foreground mt-8">
            Remember your password?{" "}
            <Link
              to="/login"
              className="text-primary hover:text-primary/80 font-medium"
            >
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
