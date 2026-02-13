const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
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

    await transporter.sendMail({
      from: `"Acumen Capital" <care@acumengroup.in>`,
      to,
      subject,
      html,
    });

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
});

app.listen(5000, () => console.log("Server running on 5000"));
