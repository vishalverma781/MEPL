// 📁 utils/sendReportEmail.js
import nodemailer from "nodemailer";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import fs from "fs";
import Issue from "../model/IssueModel.js";

export const sendReportEmail = async (emails = []) => {
  try {
    if (!emails || emails.length === 0) {
      console.log("⚠️ No additional emails provided (will send to fixed ones only)");
    }

    const issues = await Issue.find();
    if (!issues.length) {
      console.log("⚠️ No issues found to attach");
      return;
    }

    // --- Generate PDF ---
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Mahakalinfra Esolution Pvt. Ltd.", 14, 20);
    doc.setFontSize(13);
    doc.text("Issues Report", 14, 30);
    doc.line(14, 35, 195, 35);

    const tableColumn = [
      "Sr No",
      "Issue ID",
      "Plaza Name",
      "Issue Type",
      "Status",
      "Reported By",
      "Office",
    ];
    const tableRows = [];
    issues.forEach((issue, idx) => {
      tableRows.push([
        idx + 1,
        issue.issueId || "N/A",
        issue.plazaName || "N/A",
        issue.issueType || "N/A",
        issue.status || "N/A",
        issue.reporterFullName || issue.reporterUsername || "N/A",
        issue.reporterOffice || "N/A",
      ]);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      styles: { fontSize: 9 },
    });

    const pdfPath = "./Issues_Report.pdf";
    doc.save(pdfPath);

    // --- Gmail SMTP ---
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER || "vishalvermayt@gmail.com",
        pass: process.env.GMAIL_PASS || "fcjzffcnzqftmzhd", // ⚠️ App password only
      },
    });

    // --- Mail Options ---
    const mailOptions = {
      from: `"Mahakalinfra E-Solution Pvt. Ltd. ✉️" <${
        process.env.GMAIL_USER || "vishalvermayt@gmail.com"
      }>`,
      to: [
        "vishalvermayt02@gmail.com",
        "abc@gmail.com",
        "it@mahakalinfra.in",
      ], // ✅ Fixed internal recipients
      cc: emails.length > 0 ? emails.join(",") : "", // ✅ Optional frontend mails
      subject: "📋 Daily Issues Report | Mahakalinfra E-Solution Pvt. Ltd.",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 15px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #0b5394;">Mahakalinfra E-Solution Pvt. Ltd.</h2>
          <p>Dear Team,</p>
          <p>Please find attached the latest <strong>Issues Report</strong> generated from our system.</p>
          <p>This report contains the current status of all recorded issues across plazas and offices.</p>

          <p style="margin-top: 20px;">Best Regards,</p>
          <p><strong>Mahakalinfra Reports System</strong><br/>
          IT Department<br/>
          Mahakalinfra E-Solution Pvt. Ltd.<br/>
          📧 <a href="mailto:support@mahakalinfra.in">support@mahakalinfra.in</a></p>

          <hr style="margin-top: 25px;"/>
          <small style="color: gray;">This is an automated system email. Please do not reply directly.</small>
        </div>
      `,
      attachments: [
        {
          filename: "Issues_Report.pdf",
          path: pdfPath,
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully to fixed and CC recipients.");

    fs.unlinkSync(pdfPath);
  } catch (err) {
    console.error("❌ Error sending email:", err);
  }
};
