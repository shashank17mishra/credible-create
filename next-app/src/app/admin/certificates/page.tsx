"use client";

import React, { useState, useEffect } from "react";

interface Student {
  id: string;
  name: string;
  email: string;
  enrolledCourse: string;
}

interface Certificate {
  id: string;
  credentialCode: string;
  recipientName: string;
  courseTitle: string;
  issueDate: string;
  published: boolean;
}

export default function CertificatesManager() {
  const [students, setStudents] = useState<Student[]>([]);
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [userRole, setUserRole] = useState("SUB_ADMIN");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter states
  const [selectedCourse, setSelectedCourse] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Input states for codes in row format, mapped by student ID
  const [inputCodes, setInputCodes] = useState<{ [studentId: string]: string }>({});

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Extract unique courses from students
  const courses = Array.from(new Set(students.map(s => s.enrolledCourse))).filter(Boolean);

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch session role
        const sessionRes = await fetch("/api/auth/session");
        const session = await sessionRes.json();
        if (session?.user) {
          setUserRole(session.user.role);
        }

        // Fetch students & certificates
        const [studentsRes, certsRes] = await Promise.all([
          fetch("/api/admin/students"),
          fetch("/api/admin/certificates")
        ]);

        const studentsData = studentsRes.ok ? await studentsRes.json() : [];
        const certsData = certsRes.ok ? await certsRes.json() : [];

        setStudents(Array.isArray(studentsData) ? studentsData : []);
        setCerts(Array.isArray(certsData) ? certsData : []);
        setFilteredStudents(studentsData);
      } catch (err: any) {
        setError(err.message || "Error retrieving server documents");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Filter students based on selectedCourse and searchQuery
  useEffect(() => {
    let result = students;

    if (selectedCourse !== "ALL") {
      result = result.filter(s => s.enrolledCourse === selectedCourse);
    }

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(s => 
        s.name.toLowerCase().includes(q) || 
        s.email.toLowerCase().includes(q)
      );
    }

    setFilteredStudents(result);
  }, [selectedCourse, searchQuery, students]);

  // Handle certificate issuance
  const handleIssueCertificate = async (student: Student) => {
    const code = inputCodes[student.id]?.trim();
    if (!code) {
      showToast("Please enter a Credential Code", "error");
      return;
    }

    try {
      const res = await fetch("/api/admin/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          credentialCode: code,
          recipientName: student.name,
          courseTitle: student.enrolledCourse,
          issueDate: new Date().toISOString(),
          published: true
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to issue certificate");
      }

      const newCert = await res.json();
      setCerts([newCert, ...certs]);
      
      // Clear code input
      setInputCodes(prev => {
        const updated = { ...prev };
        delete updated[student.id];
        return updated;
      });

      showToast(`Certificate ${newCert.credentialCode} successfully issued to ${student.name}!`, "success");
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  // Handle certificate revocation (deletion)
  const handleRevokeCertificate = async (certId: string, code: string) => {
    if (userRole !== "SUPER_ADMIN") {
      showToast("Access Denied: Only Super Admins can revoke certificates", "error");
      return;
    }

    if (!confirm(`Are you sure you want to permanently revoke and delete certificate ${code}?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/certificates/${certId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to delete certificate");
      }

      setCerts(certs.filter(c => c.id !== certId));
      showToast(`Certificate ${code} successfully revoked`, "success");
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  const handleInputChange = (studentId: string, value: string) => {
    setInputCodes(prev => ({
      ...prev,
      [studentId]: value
    }));
  };

  return (
    <div>
      {toast && (
        <div className={`toast-msg ${toast.type}`}>
          <span style={{ fontFamily: "var(--font-mono)" }}>
            [ {toast.type === "error" ? "FAIL" : "OK"} // {toast.message.toUpperCase()} ]
          </span>
        </div>
      )}

      <div className="workspace-header">
        <div className="workspace-title">
          <h1>Student Certificate Registry</h1>
          <p>Issue verification codes and activate student certificates directly in rows</p>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "5rem 0", color: "var(--admin-text-muted)" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.9rem" }}>[ DETECTING ENROLLED STUDENT REGISTRIES // LOADING ]</span>
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
              <label className="admin-label" style={{ marginBottom: "0.25rem" }}>Search Students</label>
              <input
                type="text"
                className="admin-input"
                placeholder="Search by student name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ padding: "0.6rem 1rem" }}
              />
            </div>
            
            <div style={{ width: "300px" }}>
              <label className="admin-label" style={{ marginBottom: "0.25rem" }}>Filter by Course</label>
              <select
                className="admin-select"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                style={{ padding: "0.6rem 1rem" }}
              >
                <option value="ALL">Select All Students</option>
                {courses.map(course => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Student & Certificate Row Workspace */}
          <div className="glass-panel table-panel" style={{ padding: "1.5rem" }}>
            <h3 className="form-section-title" style={{ marginTop: 0, paddingLeft: "0.5rem" }}>
              <span style={{ color: "var(--admin-cyber-cyan)" }}>✦</span> Enrolled Students & Certifications
            </h3>
            {filteredStudents.length === 0 ? (
              <div style={{ padding: "3rem 1.5rem", textAlign: "center", color: "var(--admin-text-muted)" }}>
                No enrolled students match the filter criteria.
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Student Details</th>
                    <th>Course Title</th>
                    <th>Certificate Status</th>
                    <th>Credential Code</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => {
                    // Match certificate with name and course combination
                    const issuedCert = certs.find(
                      c => c.recipientName === student.name && c.courseTitle === student.enrolledCourse
                    );

                    return (
                      <tr key={student.id}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{student.name}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)" }}>{student.email}</div>
                        </td>
                        <td style={{ fontWeight: 500 }}>
                          {student.enrolledCourse}
                        </td>
                        <td>
                          <span className={`status-pill ${issuedCert ? "success" : "warning"}`}>
                            {issuedCert ? "ISSUED" : "NOT GENERATED"}
                          </span>
                        </td>
                        <td>
                          {issuedCert ? (
                            <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--admin-cyber-cyan)" }}>
                              {issuedCert.credentialCode}
                            </span>
                          ) : (
                            <input
                              type="text"
                              className="admin-input"
                              placeholder="e.g. CC-102"
                              value={inputCodes[student.id] || ""}
                              onChange={(e) => handleInputChange(student.id, e.target.value)}
                              style={{ width: "150px", padding: "0.4rem 0.75rem", fontSize: "0.8rem" }}
                            />
                          )}
                        </td>
                        <td style={{ textAlign: "right" }}>
                          {issuedCert ? (
                            <button
                              onClick={() => handleRevokeCertificate(issuedCert.id, issuedCert.credentialCode)}
                              className="admin-btn admin-btn-danger"
                              style={{ padding: "0.4rem 0.75rem", fontSize: "0.75rem" }}
                              disabled={userRole !== "SUPER_ADMIN"}
                              title={userRole !== "SUPER_ADMIN" ? "Revocation action restricted to Super Admins" : "Revoke certificate"}
                            >
                              Revoke
                            </button>
                          ) : (
                            <button
                              onClick={() => handleIssueCertificate(student)}
                              className="admin-btn admin-btn-primary"
                              style={{ 
                                padding: "0.4rem 0.85rem", 
                                fontSize: "0.85rem", 
                                background: "#10b981", 
                                color: "#ffffff",
                                minWidth: "40px"
                              }}
                              title="Issue Certificate"
                            >
                              {/* Green Tick mark */}
                              ✓
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}
