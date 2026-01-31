"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail?.message || "Signup failed");
      }

      router.push("/login?signup=success");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sub-background/30 p-4">
      <Card className="w-full max-w-md p-8 sm:p-10 space-y-8 bg-card-background shadow-xl shadow-border/50">
        <div className="space-y-3 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">
            Create an account
          </h1>
          <p className="text-base text-text-secondary">
            Start saving money and the planet
          </p>
        </div>
        
        <form className="space-y-5" onSubmit={handleSignup}>
          {error && <p className="text-red-600 bg-red-50 p-2 rounded-md text-sm text-center font-medium border border-red-100">{error}</p>}

          <div className="space-y-4">
            <div className="space-y-2">
               <label htmlFor="email" className="text-sm font-semibold text-text-primary ml-1">Email</label>
               <Input 
                id="email" 
                type="email" 
                placeholder="name@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-semibold text-text-primary ml-1">Password</label>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="confirm-password" className="text-sm font-semibold text-text-primary ml-1">Confirm Password</label>
              <Input 
                id="confirm-password" 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required 
              />
            </div>
          </div>
          
          <Button type="submit" fullWidth disabled={loading} size="lg" className="mt-2">
            {loading ? "Creating account..." : "Create account"}
          </Button>

        </form>
        
        <div className="text-center text-sm text-text-secondary">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary hover:text-primary-hover hover:underline underline-offset-4">
            Log in
          </Link>
        </div>
      </Card>
    </div>
  );
}
