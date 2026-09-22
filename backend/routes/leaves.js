const express = require("express");
const LeaveRequest = require("../models/LeaveRequest");
const User = require("../models/User");
const { auth, requireRole } = require("../middleware/auth");

const router = express.Router();

router.use(auth);

// POST /api/leaves - an employee submits a leave request.
router.post("/", async (req, res) => {
  const { leaveType, startDate, endDate, reason } = req.body;
  if (!leaveType || !startDate || !endDate || !reason) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (new Date(endDate) < new Date(startDate)) {
    return res.status(400).json({ message: "End date cannot be before the start date" });
  }

  const leave = await LeaveRequest.create({
    employeeId: req.user.id,
    leaveType,
    startDate,
    endDate,
    reason,
  });

  res.status(201).json(await leave.populate("employeeId", "name email"));
});

// GET /api/leaves/mine - the logged-in employee's own requests.
router.get("/mine", async (req, res) => {
  const leaves = await LeaveRequest.find({ employeeId: req.user.id }).sort({ createdDate: -1 });
  res.json(leaves);
});

// GET /api/leaves?status=&search= - manager view of every request.
router.get("/", requireRole("Manager"), async (req, res) => {
  const { status, search } = req.query;
  const filter = {};

  if (status && status !== "All") filter.status = status;

  if (search) {
    const matches = await User.find({ name: { $regex: search, $options: "i" } }).select("_id");
    filter.employeeId = { $in: matches.map((u) => u._id) };
  }

  const leaves = await LeaveRequest.find(filter)
    .populate("employeeId", "name email")
    .sort({ createdDate: -1 });

  res.json(leaves);
});

// GET /api/leaves/:id - one request (managers, or the employee who owns it).
router.get("/:id", async (req, res) => {
  const leave = await LeaveRequest.findById(req.params.id).populate("employeeId", "name email");
  if (!leave) return res.status(404).json({ message: "Leave request not found" });

  const isOwner = String(leave.employeeId._id) === req.user.id;
  if (req.user.role !== "Manager" && !isOwner) {
    return res.status(403).json({ message: "Not allowed to view this request" });
  }

  res.json(leave);
});

// PATCH /api/leaves/:id/status - a manager approves or rejects.
router.patch("/:id/status", requireRole("Manager"), async (req, res) => {
  const { status } = req.body;
  if (!["Approved", "Rejected"].includes(status)) {
    return res.status(400).json({ message: "Status must be Approved or Rejected" });
  }

  const leave = await LeaveRequest.findByIdAndUpdate(
    req.params.id,
    { status },
    { returnDocument: "after" }
  ).populate("employeeId", "name email");

  if (!leave) return res.status(404).json({ message: "Leave request not found" });
  res.json(leave);
});

// DELETE /api/leaves/:id - an employee withdraws a request still pending.
router.delete("/:id", async (req, res) => {
  const leave = await LeaveRequest.findById(req.params.id);
  if (!leave) return res.status(404).json({ message: "Leave request not found" });
  if (String(leave.employeeId) !== req.user.id) {
    return res.status(403).json({ message: "Not allowed to delete this request" });
  }
  if (leave.status !== "Pending") {
    return res.status(400).json({ message: "Only pending requests can be withdrawn" });
  }

  await leave.deleteOne();
  res.json({ message: "Leave request withdrawn" });
});

module.exports = router;
