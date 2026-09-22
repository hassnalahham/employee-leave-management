import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api";
import { useAuth } from "../../context/useAuth";
import StatusBadge from "../../components/StatusBadge";
import { countDays, formatDate } from "../../utils";

export default function MyRequests() {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api
      .myLeaves()
      .then((data) => active && setLeaves(data))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, []);

  async function withdraw(id) {
    try {
      await api.deleteLeave(id);
      setLeaves((prev) => prev.filter((leave) => leave._id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  const counts = {
    Pending: leaves.filter((l) => l.status === "Pending").length,
    Approved: leaves.filter((l) => l.status === "Approved").length,
    Rejected: leaves.filter((l) => l.status === "Rejected").length,
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Welcome back, {user.name.split(" ")[0]}</h1>
          <p className="muted">Here is everything you have requested so far.</p>
        </div>
        <Link className="button" to="/employee/new">
          New request
        </Link>
      </div>

      <div className="stats">
        {Object.entries(counts).map(([status, count]) => (
          <div className="card stat" key={status}>
            <span className="stat-value">{count}</span>
            <span className="muted">{status}</span>
          </div>
        ))}
      </div>

      {error && <p className="error">{error}</p>}

      <div className="card">
        {loading ? (
          <p className="muted">Loading requests…</p>
        ) : leaves.length === 0 ? (
          <p className="muted">
            No leave requests yet. <Link to="/employee/new">Submit your first one.</Link>
          </p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Dates</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Submitted</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {leaves.map((leave) => (
                <tr key={leave._id}>
                  <td>{leave.leaveType}</td>
                  <td>
                    {formatDate(leave.startDate)} – {formatDate(leave.endDate)}
                  </td>
                  <td>{countDays(leave.startDate, leave.endDate)}</td>
                  <td className="reason">{leave.reason}</td>
                  <td>{formatDate(leave.createdDate)}</td>
                  <td>
                    <StatusBadge status={leave.status} />
                  </td>
                  <td>
                    {leave.status === "Pending" && (
                      <button
                        type="button"
                        className="ghost danger"
                        onClick={() => withdraw(leave._id)}
                      >
                        Withdraw
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
