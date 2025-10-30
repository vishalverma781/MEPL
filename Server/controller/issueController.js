import Issue from "../model/IssueModel.js";
import Role from "../model/RoleModel.js";

// Create issue
export const createIssue = async (req, res) => {
  try {
    const { issueType, description, time } = req.body;
    if (!issueType || !description)
      return res.status(400).json({ msg: "Missing required fields" });

    const userId = req.user.id;
    let reporterUsername = req.user.username || "";
    let reporterFullName = req.user.fullName || "";
    let plazaName = req.user.plaza || "N/A";
    let reporterOffice = "Not Assigned"; // default

    // ✅ Role lookup for accurate office & plaza info
    try {
      const role = await Role.findOne({ employeeId: userId })
        .populate("employeeId assignedPlaza");

      if (role) {
        reporterUsername = role.employeeId?.username || reporterUsername;
        reporterFullName = role.employeeId?.fullName || reporterFullName;
        plazaName = role.assignedPlaza?.plazaName || plazaName;

        reporterOffice =
          role.office === "head"
            ? "Head Office"
            : role.office === "branch"
            ? "Branch Office"
            : "Not Assigned";
      }
    } catch (errRole) {
      console.warn("Role lookup failed, using token values");
    }

    const newIssue = new Issue({
      reportedBy: userId,
      reporterUsername,
      reporterFullName,
      reporterOffice, // added here
      plazaName,
      issueType,
      description,
      time,
    });

    const saved = await newIssue.save();
    return res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error" });
  }
};

// ✅ Get issues — now fetches office from Role model
export const getIssues = async (req, res) => {
  try {
    const userRole = req.user.role;
    const userId = req.user.id;
    let query = {};

    if (userRole === "Employee") query.reportedBy = userId;

    const issues = await Issue.find(query)
      .sort({ createdAt: -1 })
      .populate("reportedBy", "username fullName");

    // ✅ Map each issue with Role-based office
    const issuesWithOffice = await Promise.all(
      issues.map(async (issue) => {
        let reporterOffice = "Not Assigned";

        // Find role of reporter
        const role = await Role.findOne({ employeeId: issue.reportedBy?._id });
        if (role) {
          reporterOffice =
            role.office === "head"
              ? "Head Office"
              : role.office === "branch"
              ? "Branch Office"
              : "Not Assigned";
        }

        return {
          ...issue._doc,
          reporterOffice,
        };
      })
    );

    return res.json(issuesWithOffice);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Resolve issue
export const resolveIssue = async (req, res) => {
  try {
    const id = req.params.id;
    const { status, remarks } = req.body;

    // ✅ Remarks required only if status = "Resolved"
    if (status === "Resolved" && (!remarks || !remarks.trim())) {
      return res.status(400).json({ msg: "Remarks required for resolved issue" });
    }

    const issue = await Issue.findById(id);
    if (!issue) return res.status(404).json({ msg: "Issue not found" });

    if (req.user.role !== "Admin" && issue.reportedBy.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized to resolve" });
    }

    // ✅ Dynamic update (Pending / Resolved dono handle karega)
    issue.status = status || "Pending";
    issue.remarks = remarks || "";
    issue.rectifiedDate = status === "Resolved" ? new Date() : null; // ✅ Only for resolved

    await issue.save();

    return res.json(issue);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error" });
  }
};
