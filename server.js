const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

const transporter = nodemailer.createTransport({
  host: "smtp.pepipost.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

app.post("/sendMail", async (req, res) => {
  try {
    const { to, subject, html } = req.body;

    if (!to || !subject || !html) {
      return res.status(400).json({ error: "Missing fields" });
    }

    await transporter.sendMail({
      from: `"Acumen Capital" <care@acumengroup.in>`,
      to,
      subject,
      html,
    });

    res.json({ success: true });
  } catch (err) {
  console.error("MAIL ERROR FULL:", err);
  console.error("MESSAGE:", err.message);
  console.error("RESPONSE:", err.response);
  res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
