import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Loader2, AlertTriangle } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [hasRecoverySession, setHasRecoverySession] = useState(false);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!active) return;
      setHasRecoverySession(!sessionError && Boolean(data.session));
      setCheckingSession(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      if (event === "PASSWORD_RECOVERY" || session) setHasRecoverySession(true);
      if (!session && event === "SIGNED_OUT") setHasRecoverySession(false);
      setCheckingSession(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (newPassword.length < 8) {
      setError("Your password must contain at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!hasRecoverySession) {
      setError("Your password-reset session has expired. Request a new link.");
      return;
    }

    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
      if (updateError) throw updateError;
      await supabase.auth.signOut();
      navigate("/login", { replace: true, state: { message: "Password updated. Please sign in." } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password. Please request a new link.");
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <AuthLayout icon={Lock} title="Checking reset link" subtitle="Verifying your password-reset session">
        <div className="flex justify-center py-4" role="status" aria-label="Checking reset session">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
      </AuthLayout>
    );
  }

  if (!hasRecoverySession) {
    return (
      <AuthLayout
        icon={AlertTriangle}
        title="Reset link expired"
        subtitle="This password-reset session is missing or has expired."
        footer={
          <Link to="/forgot-password" className="text-primary font-medium hover:underline">
            Request a new reset link
          </Link>
        }
      >
        <p className="text-sm text-foreground text-center">For your security, request a new link and open it in the same browser.</p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout icon={Lock} title="New password" subtitle="Choose a new password for your account">
      {error && <div role="alert" className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">New password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input id="password" type="password" autoComplete="new-password" minLength={8} autoFocus required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="pl-10 h-12" placeholder="At least 8 characters" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm">Confirm password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input id="confirm" type="password" autoComplete="new-password" minLength={8} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="pl-10 h-12" placeholder="Re-enter your password" />
          </div>
        </div>
        <Button type="submit" className="w-full h-12 font-medium" disabled={loading}>
          {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Updating password...</> : "Update password"}
        </Button>
      </form>
    </AuthLayout>
  );
}
