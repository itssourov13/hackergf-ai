import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Mail, Lock, Loader2 } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import GoogleIcon from "@/components/GoogleIcon";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [showOtp, setShowOtp] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      setShowOtp(true);

    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };


  const verifyOtp = async () => {
    setError("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "signup",
      });

      if (error) throw error;

      window.location.href = "/";

    } catch (err) {
      setError(err.message || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  };


  const handleGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) setError(error.message);
  };


  if (showOtp) {
    return (
      <AuthLayout
        icon={Mail}
        title="Verify your email"
        subtitle={`Enter the code sent to ${email}`}
      >

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">

          <Input
            value={otp}
            onChange={(e)=>setOtp(e.target.value)}
            placeholder="Enter 6 digit code"
            maxLength={6}
            className="h-12 text-center text-lg tracking-widest"
          />


          <Button
            onClick={verifyOtp}
            className="w-full h-12"
            disabled={loading || otp.length < 6}
          >

          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin"/>
              Verifying...
            </>
          ):(
            "Verify Email"
          )}

          </Button>

        </div>

      </AuthLayout>
    );
  }


  return (
    <AuthLayout
      icon={UserPlus}
      title="Create your account"
      subtitle="Sign up to get started"
      footer={
        <>
        Already have an account?{" "}
        <Link to="/login" className="text-primary font-medium hover:underline">
          Log in
        </Link>
        </>
      }
    >

      <Button
        variant="outline"
        className="w-full h-12 mb-6"
        onClick={handleGoogle}
      >
        <GoogleIcon className="w-5 h-5 mr-2"/>
        Continue with Google
      </Button>


      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}


      <form onSubmit={handleSubmit} className="space-y-4">


        <div>
          <Label>Email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
          />
        </div>


        <div>
          <Label>Password</Label>
          <Input
            type="password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
          />
        </div>


        <div>
          <Label>Confirm Password</Label>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e)=>setConfirmPassword(e.target.value)}
            required
          />
        </div>


        <Button
          type="submit"
          className="w-full h-12"
          disabled={loading}
        >

        {loading ? (
          <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin"/>
          Creating account...
          </>
        ):(
          "Create account"
        )}

        </Button>


      </form>

    </AuthLayout>
  );
}
