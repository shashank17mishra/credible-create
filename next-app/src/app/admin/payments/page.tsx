"use client";

import React, { useState, useEffect } from "react";

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  createdAt: string;
  user?: {
    name: string | null;
    email: string;
  };
}

export default function PaymentsLedger() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter states
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    async function loadPayments() {
      try {
        const res = await fetch("/api/admin/payments");
        if (!res.ok) throw new Error("Failed to load payment logs");
        const data = await res.json();
        setPayments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loaded payment logs");
      } finally {
        setLoading(false);
      }
    }

    loadPayments();
  }, []);

  // Filter implementation
  const filteredPayments = React.useMemo(() => {
    let result = payments;

    if (search.trim() !== "") {
      const q = search.toLowerCase();
      result = result.filter(p => 
        p.user?.name?.toLowerCase().includes(q) ||
        p.user?.email?.toLowerCase().includes(q) ||
        p.razorpayOrderId?.toLowerCase().includes(q) ||
        p.razorpayPaymentId?.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "ALL") {
      result = result.filter(p => p.status === statusFilter);
    }

    return result;
  }, [search, statusFilter, payments]);

  return (
    <div>
      <div className="workspace-header">
        <div className="workspace-title">
          <h1>Razorpay Transactions Ledger</h1>
          <p>Inspect incoming subscription fees, invoices, and payment states</p>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "5rem 0", color: "var(--admin-text-muted)" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.9rem" }}>[ DETECTING INCOMING TRANSACTIONS // LOADING ]</span>
        </div>
      ) : error ? (
        <div className="login-error" style={{ padding: "2rem" }}>
          [ EXCEPTION // {error.toUpperCase()} ]
        </div>
      ) : (
        <>
          {/* Filters Bar */}
          <div className="glass-panel" style={{ padding: "1.5rem", marginBottom: "2rem", display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ flex: 1, minWidth: "250px" }}>
              <label className="admin-label" style={{ marginBottom: "0.25rem" }}>Search Registry</label>
              <input
                type="text"
                className="admin-input"
                placeholder="Search by name, email, or Razorpay ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ padding: "0.6rem 1rem" }}
              />
            </div>
            
            <div style={{ width: "200px" }}>
              <label className="admin-label" style={{ marginBottom: "0.25rem" }}>Filter Status</label>
              <select
                className="admin-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ padding: "0.6rem 1rem" }}
              >
                <option value="ALL">All Payments</option>
                <option value="SUCCESS">SUCCESS</option>
                <option value="PENDING">PENDING</option>
                <option value="FAILED">FAILED</option>
              </select>
            </div>
          </div>

          {/* Ledger Table */}
          <div className="glass-panel table-panel" style={{ padding: "1.5rem" }}>
            {filteredPayments.length === 0 ? (
              <div style={{ padding: "3rem 1.5rem", textAlign: "center", color: "var(--admin-text-muted)" }}>
                No payment transactions matched your filters.
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>User</th>
                    <th>Razorpay Order ID</th>
                    <th>Razorpay Payment ID</th>
                    <th>Amount</th>
                    <th style={{ textAlign: "right" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id}>
                      <td style={{ fontSize: "0.8rem", color: "var(--admin-text-muted)" }}>
                        {new Date(payment.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{payment.user?.name || "Anonymous User"}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)" }}>{payment.user?.email}</div>
                      </td>
                      <td style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--admin-cyber-cyan)" }}>
                        {payment.razorpayOrderId || "—"}
                      </td>
                      <td style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--admin-cyber-cyan)" }}>
                        {payment.razorpayPaymentId || "—"}
                      </td>
                      <td style={{ fontWeight: 700, fontSize: "0.95rem" }}>
                        {new Intl.NumberFormat("en-IN", {
                          style: "currency",
                          currency: "INR",
                          maximumFractionDigits: 0
                        }).format(payment.amount)}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <span className={`status-pill ${
                          payment.status === "SUCCESS" ? "success" : 
                          payment.status === "PENDING" ? "warning" : "danger"
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}
