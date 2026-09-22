import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api";
import StatusBadge from "../../components/StatusBadge";
import { countDays, formatDate } from "../../utils";

const STATUSES = ["All", "Pending", "Approved", "Rejected"];

export default function Requests() {
  const [leaves, setLeaves] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      api
        .allLeaves({ status, search })
        .then(setLeaves)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(timer);
  }, [status, search]);

  async function decide(id, next) {
    try {
      const updated = await api.setLeaveStatus(id, next);
      setLeaves((prev) =>
        status === "All"
          ? prev.map((leave) => (leave._id === id ? updated : leave))
          : prev.filter((leave) => leave._id !== id),
      );
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Leave requests</h1>
          <p className="muted">
            Review, approve or reject requests from your team.
          </p>
        </div>
      </div>

      <div className="card filters">
        <input
          type="search"
          placeholder="Search by employee name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="chips">
          {STATUSES.map((option) => (
            <button
              type="button"
              key={option}
              className={`chip ${status === option ? "active" : ""}`}
              onClick={() => setStatus(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="card">
        {loading ? (
          <p className="muted">Loading requests…</p>
        ) : leaves.length === 0 ? (
          <p className="muted">No requests match the current filters.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Type</th>
                <th>Dates</th>
                <th>Days</th>
                <th>Submitted</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {leaves.map((leave) => (
                <tr key={leave._id}>
                  <td>
                    <Link to={`/manager/${leave._id}`}>
                      {leave.employeeId?.name || "Unknown"}
                    </Link>
                  </td>
                  <td>{leave.leaveType}</td>
                  <td>
                    {formatDate(leave.startDate)} – {formatDate(leave.endDate)}
                  </td>
                  <td>{countDays(leave.startDate, leave.endDate)}</td>
                  <td>{formatDate(leave.createdDate)}</td>
                  <td>
                    <StatusBadge status={leave.status} />
                  </td>
                  <td className="row-actions">
                    {leave.status === "Pending" ? (
                      <>
                        <button
                          type="button"
                          onClick={() => decide(leave._id, "Approved")}
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          className="ghost danger"
                          onClick={() => decide(leave._id, "Rejected")}
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <Link
                        className="ghost button"
                        to={`/manager/${leave._id}`}
                      >
                        View
                      </Link>
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
