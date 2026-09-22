const mongoose = require("mongoose");

const leaveRequestSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  leaveType: {
    type: String,
    enum: ["Annual", "Sick", "Unpaid", "Maternity", "Other"],
    required: true,
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  reason: { type: String, required: true, trim: true },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  createdDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("LeaveRequest", leaveRequestSchema);
