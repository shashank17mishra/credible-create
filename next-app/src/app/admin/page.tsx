"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface StatLog {
  id: string;
  type: string;
  description: string;
  time: string;
}

interface StatsData {
  postsCount: number;
  certificatesCount: number;
  paymentsCount: number;
  paymentsTotal: number;
  usersCount: number;
  recentLogs: StatLog[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dbStatus, setDbStatus] = useState("CALIBRATING");
  const [latency, setLatency] = useState(12);

  useEffect(() => {
    async function fetchStats() {
      try {
        const start = Date.now();
        const res = await fetch("/api/admin/stats");
        const lat = Date.now() - start;
        setLatency(lat);

        if (!res.ok) {
          throw new Error("Failed to fetch system metrics");
        }
        const data = await res.json();
        setStats(data);
        setDbStatus("ONLINE");
      } catch (err: any) {
        setError(err.message || "Error loading system data");
        setDbStatus("ERROR");
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <div>
      <div className="workspace-header">
        <div className="workspace-title">
          <h1>Control Center Overview</h1>
          <p>Real-time analytics and system diagnostic telemetry</p>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button 
            onClick={() => window.location.reload()} 
            className="admin-btn admin-btn-secondary"
            style={{ fontSize: "0.8rem", padding: "0.5rem 1rem" }}
          >
            Refresh Diagnostics
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "5rem 0", color: "var(--admin-text-muted)" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.9rem" }}>[ DETECTING CORE METRICS // LOADING ]</span>
        </div>
      ) : error ? (
        <div className="login-error" style={{ padding: "2rem" }}>
          [ DIAGNOSTIC EXCEPTION // {error.toUpperCase()} ]
        </div>
      ) : stats ? (
        <>
          {/* Metrics Grid */}
          <div className="metrics-grid">
            <div className="metric-card glass-panel">
              <div className="metric-header">
                <span className="metric-title">Content Engine</span>
                <div className="metric-icon-box indigo">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 20, height: 20 }}>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
              </div>
              <div className="metric-value">{stats.postsCount}</div>
              <div className="metric-subtitle">Total Composed Articles</div>
            </div>

            <div className="metric-card glass-panel">
              <div className="metric-header">
                <span className="metric-title">Verified Achievements</span>
                <div className="metric-icon-box cyan">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 20, height: 20 }}>
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
              </div>
              <div className="metric-value">{stats.certificatesCount}</div>
              <div className="metric-subtitle">Issued Certificate Hashes</div>
            </div>

            <div className="metric-card glass-panel">
              <div className="metric-header">
                <span className="metric-title">Secured Registers</span>
                <div className="metric-icon-box purple">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 20, height: 20 }}>
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                  </svg>
                </div>
              </div>
              <div className="metric-value">{stats.usersCount}</div>
              <div className="metric-subtitle">Active Credentials</div>
            </div>

            <div className="metric-card glass-panel">
              <div className="metric-header">
                <span className="metric-title">Processed Transactions</span>
                <div className="metric-icon-box amber">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 20, height: 20 }}>
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
              </div>
              <div className="metric-value">
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                  maximumFractionDigits: 0
                }).format(stats.paymentsTotal)}
              </div>
              <div className="metric-subtitle">{stats.paymentsCount} Total Invoices</div>
            </div>
          </div>

          {/* Details & Logs Grid */}
          <div className="dashboard-details-grid">
            {/* System logs */}
            <div className="system-logs-box glass-panel">
              <h3 className="form-section-title" style={{ marginTop: 0 }}>
                <span style={{ color: "var(--admin-cyber-indigo)" }}>✦</span> System Operations Log
              </h3>
              <div style={{ marginTop: "1rem" }}>
                {stats.recentLogs.length === 0 ? (
                  <div style={{ color: "var(--admin-text-muted)", fontSize: "0.85rem", fontStyle: "italic" }}>
                    No recent administrative transactions registered.
                  </div>
                ) : (
                  stats.recentLogs.map((log) => (
                    <div className="log-entry" key={log.id}>
                      <span className="log-meta">[{log.type}]</span>
                      <span className="log-desc">{log.description}</span>
                      <span className="log-time">
                        {new Date(log.time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit"
                        })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Diagnostic Monitor */}
            <div className="system-logs-box glass-panel">
              <h3 className="form-section-title" style={{ marginTop: 0 }}>
                <span style={{ color: "var(--admin-cyber-cyan)" }}>✦</span> Diagnostic Feeds
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginTop: "1.5rem" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.25rem" }}>
                    <span style={{ color: "var(--admin-text-muted)" }}>SQLITE ENGINE</span>
                    <span className={`status-pill ${dbStatus === "ONLINE" ? "success" : "danger"}`} style={{ padding: "0.1rem 0.4rem", fontSize: "0.6rem" }}>
                      {dbStatus}
                    </span>
                  </div>
                  <div style={{ height: "4px", background: "rgba(0,0,0,0.05)", borderRadius: "2px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: dbStatus === "ONLINE" ? "100%" : "0%", background: "#10b981", transition: "width 0.5s" }}></div>
                  </div>
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.25rem" }}>
                    <span style={{ color: "var(--admin-text-muted)" }}>API RESPONSE TIME</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: latency < 100 ? "#10b981" : "#f59e0b" }}>
                      {latency} ms
                    </span>
                  </div>
                  <div style={{ height: "4px", background: "rgba(0,0,0,0.05)", borderRadius: "2px", overflow: "hidden" }}>
                    <div 
                      style={{ 
                        height: "100%", 
                        width: `${Math.min(100, Math.max(5, (100 - latency / 3)))}%`, 
                        background: latency < 100 ? "#10b981" : "#f59e0b", 
                        transition: "width 0.5s" 
                      }}
                    ></div>
                  </div>
                </div>

                <div style={{ borderTop: "1px solid var(--admin-border-glass)", paddingTop: "1rem", marginTop: "0.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--admin-text-muted)", marginBottom: "0.5rem" }}>
                    <span>AETHER ROUTING</span>
                    <span style={{ fontFamily: "var(--font-mono)", color: "var(--admin-cyber-cyan)" }}>OK // LOCALHOST</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--admin-text-muted)" }}>
                    <span>SESSION ROLE</span>
                    <span style={{ fontFamily: "var(--font-mono)", color: "var(--admin-cyber-purple)" }}>GRANTED</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
