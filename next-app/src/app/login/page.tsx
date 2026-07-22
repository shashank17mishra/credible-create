"use client";

import React, { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import "../admin/admin.css";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const callbackUrl = searchParams.get("callbackUrl") || "/admin";
  const authError = searchParams.get("error");

  useEffect(() => {
    if (authError === "CredentialsSignin") {
      setError("Invalid credentials. Access denied.");
    } else if (authError) {
      setError("Authentication failed. Please try again.");
    }
  }, [authError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Invalid email or password.");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="login-error">[ ERROR // {error.toUpperCase()} ]</div>}

      <div className="admin-form-group">
        <label className="admin-label" htmlFor="email">
          Terminal Identifier (Email)
        </label>
        <input
          type="email"
          id="email"
          className="admin-input"
          placeholder="e.g. admin@crediblecreate.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="admin-form-group">
        <label className="admin-label" htmlFor="password">
          Security Key (Password)
        </label>
        <input
          type="password"
          id="password"
          className="admin-input"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="admin-btn admin-btn-primary" style={{ width: "100%", marginTop: "1rem" }} disabled={loading}>
        {loading ? "Decrypting Credentials..." : "Authenticate"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="admin-body login-body">
      <div className="login-card glass-panel">
        <Link href="/" className="login-logo">
          <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 2 7 12 12 22 7" />
            <polygon points="2 7 12 12 12 22 2 17" />
            <polygon points="12 12 22 7 22 17 12 22" />
          </svg>
          <span>CREDIBLE // CREATE</span>
        </Link>

        <div className="login-header">
          <h1>Admin Control Login</h1>
          <p>Provide secure credentials to access control terminal</p>
        </div>

        <Suspense fallback={
          <div style={{ textAlign: "center", color: "var(--admin-text-muted)", fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>
            [ INITIALIZING LOGIN TELEMETRY // LOADING ]
          </div>
        }>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
