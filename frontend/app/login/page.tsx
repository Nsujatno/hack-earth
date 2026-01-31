"use client";

import { Button, buttonVariants } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail?.message || "Login failed");
      }

      if (data.session?.access_token) {
        localStorage.setItem("access_token", data.session.access_token);
        router.push("/");
      } else {
        throw new Error("No access token received");
      }
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
            Welcome back
          </h1>
          <p className="text-base text-text-secondary">
            Access your green savings dashboard
          </p>
        </div>
        
        <form className="space-y-5" onSubmit={handleLogin}>
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
          </div>
          
          <Button type="submit" fullWidth disabled={loading} size="lg" className="mt-2">
            {loading ? "Signing in..." : "Sign in"}
          </Button>

        </form>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-wider">
            <span className="bg-card-background px-3 text-text-secondary font-medium">
              Or
            </span>
          </div>
        </div>

        <Link 
          href="/signup" 
          className={cn(buttonVariants({ variant: "secondary", fullWidth: true, size: "lg" }), "w-full")}
        >
          Create an account
        </Link>
      </Card>
    </div>
  );
}
