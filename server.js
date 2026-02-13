const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();

/**
 * ✅ Allowed frontend domains
 */
const allowedOrigins = [
  "https://mail-service-provider.netlify.app",
  "http://localhost:3000",
];

/**
 * ✅ CORS setup
 */
app.use(
  cors({
    origin: function (origin, callback) {
      // allow server-to-server or curl/postman
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());

/**
 * ✅ SMTP transporter
 */
const transporter = nodemailer.createTransport({
  host: "smtp.pepipost.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * ✅ Send mail route
 */
app.post("/sendMail", async (req, res) => {
  try {
    const { to, subject, html } = req.body;

    console.log("REQUEST BODY:", req.body);

    if (!to || !subject || !html) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const info = await transporter.sendMail({
      from: `"Acumen Capital" <care@acumengroup.in>`,
      to,
      subject,
      html,
    });

    console.log("MAIL SENT:", info.messageId);

    res.json({ success: true });
  } catch (err) {
    console.error("MAIL ERROR FULL:", err);
    console.error("MESSAGE:", err.message);
    console.error("RESPONSE:", err.response);

    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * ✅ Render dynamic port
 */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
