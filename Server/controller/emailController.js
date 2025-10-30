import EmailList from "../model/EmailModel.js";

// 🟢 Add or update emails for a project
export const saveEmails = async (req, res) => {
  try {
    const { projectId, emails } = req.body;
    if (!projectId || !emails || emails.length === 0) {
      return res.status(400).json({ error: "Project ID and emails required" });
    }

    let existing = await EmailList.findOne({ projectId });

    if (existing) {
      existing.emails.push(...emails.filter((e) => !existing.emails.includes(e)));
      await existing.save();
      return res.status(200).json({ message: "Emails updated successfully", data: existing });
    } else {
      const newList = new EmailList({ projectId, emails });
      await newList.save();
      return res.status(201).json({ message: "Emails added successfully", data: newList });
    }
  } catch (err) {
    console.error("❌ Error saving emails:", err);
    res.status(500).json({ error: "Failed to save emails" });
  }
};

// 🗑️ Remove email
export const removeEmail = async (req, res) => {
  try {
    const { projectId, email } = req.body;
    const list = await EmailList.findOne({ projectId });
    if (!list) return res.status(404).json({ error: "No email list found" });

    list.emails = list.emails.filter((e) => e !== email);
    await list.save();

    res.status(200).json({ message: "Email removed", data: list });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove email" });
  }
};

// 🔍 Get emails
export const getEmails = async (req, res) => {
  try {
    const { projectId } = req.params;
    const list = await EmailList.findOne({ projectId });
    res.status(200).json(list || { emails: [] });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch emails" });
  }
};
