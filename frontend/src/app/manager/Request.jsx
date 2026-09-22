import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../../api";
import StatusBadge from "../../components/StatusBadge";
import { countDays, formatDate } from "../../utils";

export default function Request() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [leave, setLeave] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.leave(id).then(setLeave).catch((err) => setError(err.message));
  }, [id]);

  async function decide(status) {
    try {
      setLeave(await api.setLeaveStatus(id, status));
    } catch (err) {
      setError(err.message);
    }
  }

  if (error) return <p className="error">{error}</p>;
  if (!leave) return <p className="muted">Loading request…</p>;

  return (
    <>
      <div className="page-head">
        <div>
          <Link className="back" to="/manager">
            ← All requests
          </Link>
          <h1>{leave.employeeId?.name}</h1>
          <p className="muted">{leave.employeeId?.email}</p>
        </div>
        <StatusBadge status={leave.status} />
      </div>

      <div className="card detail">
        <div>
          <span className="muted">Leave type</span>
          <strong>{leave.leaveType}</strong>
        </div>
        <div>
          <span className="muted">Dates</span>
          <strong>
            {formatDate(leave.startDate)} – {formatDate(leave.endDate)}
          </strong>
        </div>
        <div>
          <span className="muted">Duration</span>
          <strong>{countDays(leave.startDate, leave.endDate)} day(s)</strong>
        </div>
        <div>
          <span className="muted">Submitted on</span>
          <strong>{formatDate(leave.createdDate)}</strong>
        </div>
        <div className="full">
          <span className="muted">Reason</span>
          <strong>{leave.reason}</strong>
        </div>
      </div>

      <div className="actions">
        <button
          type="button"
          disabled={leave.status === "Approved"}
          onClick={() => decide("Approved")}
        >
          Approve
        </button>
        <button
          type="button"
          className="ghost danger"
          disabled={leave.status === "Rejected"}
          onClick={() => decide("Rejected")}
        >
          Reject
        </button>
        <button type="button" className="ghost" onClick={() => navigate("/manager")}>
          Back to list
        </button>
      </div>
    </>
  );
}
