import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api";

const LEAVE_TYPES = ["Annual", "Sick", "Unpaid", "Maternity", "Other"];
const EMPTY = { leaveType: "Annual", startDate: "", endDate: "", reason: "" };

export default function CreateRequest() {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (form.endDate < form.startDate) {
      setError("End date cannot be before the start date.");
      return;
    }

    setBusy(true);
    try {
      await api.createLeave(form);
      navigate("/employee");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1>New leave request</h1>
          <p className="muted">Your manager will review it shortly.</p>
        </div>
      </div>

      <form className="card form" onSubmit={handleSubmit}>
        <label>
          Leave type
          <select
            value={form.leaveType}
            onChange={(e) => update("leaveType", e.target.value)}
          >
            {LEAVE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <div className="row">
          <label>
            Start date
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => update("startDate", e.target.value)}
              required
            />
          </label>
          <label>
            End date
            <input
              type="date"
              value={form.endDate}
              min={form.startDate || undefined}
              onChange={(e) => update("endDate", e.target.value)}
              required
            />
          </label>
        </div>

        <label>
          Reason
          <textarea
            rows="4"
            value={form.reason}
            onChange={(e) => update("reason", e.target.value)}
            placeholder="Briefly explain the reason for your leave"
            required
          />
        </label>

        {error && <p className="error">{error}</p>}

        <div className="actions">
          <button type="submit" disabled={busy}>
            {busy ? "Submitting…" : "Submit request"}
          </button>
          <button type="button" className="ghost" onClick={() => navigate("/employee")}>
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}
