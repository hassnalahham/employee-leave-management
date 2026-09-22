import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const EMPTY = { name: "", email: "", password: "", role: "Employee" };

export default function Login() {
  const { user, login, register } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) {
    return <Navigate to={user.role === "Manager" ? "/manager" : "/employee"} replace />;
  }

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const account =
        mode === "login"
          ? await login(form.email, form.password)
          : await register(form);
      navigate(account.role === "Manager" ? "/manager" : "/employee", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="card auth-card" onSubmit={handleSubmit}>
        <h1>Leave Management</h1>
        <p className="muted">
          {mode === "login" ? "Sign in to your account" : "Create a new account"}
        </p>

        {mode === "register" && (
          <label>
            Name
            <input
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Jane Doe"
              required
            />
          </label>
        )}

        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="you@company.com"
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            placeholder="••••••••"
            required
          />
        </label>

        {mode === "register" && (
          <label>
            Role
            <select value={form.role} onChange={(e) => update("role", e.target.value)}>
              <option value="Employee">Employee</option>
              <option value="Manager">Manager</option>
            </select>
          </label>
        )}

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={busy}>
          {busy ? "Please wait…" : mode === "login" ? "Log in" : "Sign up"}
        </button>

        <button
          type="button"
          className="link"
          onClick={() => {
            setMode(mode === "login" ? "register" : "login");
            setForm(EMPTY);
            setError("");
          }}
        >
          {mode === "login"
            ? "No account? Sign up"
            : "Already registered? Log in"}
        </button>
      </form>
    </div>
  );
}
