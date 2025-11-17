"use strict";

const { initiateStkPush } = require("../lib/mpesa");

function sendCors(res) {
res.setHeader("Access-Control-Allow-Origin", "*");
res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

module.exports = async (req, res) => {
sendCors(res);
if (req.method === "OPTIONS") {
return res.status(200).end();
}
if (req.method !== "POST") {
return res.status(405).json({ error: "Method Not Allowed" });
}
try {
const {
MPESA_ENV,
MPESA_CONSUMER_KEY,
MPESA_CONSUMER_SECRET,
MPESA_SHORTCODE,
MPESA_PASSKEY,
MPESA_CALLBACK_URL
} = process.env;

if (!MPESA_CONSUMER_KEY || !MPESA_CONSUMER_SECRET || !MPESA_SHORTCODE || !MPESA_PASSKEY || !MPESA_CALLBACK_URL) {
return res.status(500).json({ error: "Server not configured. Missing MPESA env vars." });
}

const body = req.body || {};
const phone = String(body.phone || body.msisdn || "").trim();
const amount = Number(body.amount);
const accountReference = body.accountReference ? String(body.accountReference) : "TEST";
const transactionDesc = body.transactionDesc ? String(body.transactionDesc) : "Payment";

if (!phone) {
return res.status(400).json({ error: "phone is required" });
}
if (!Number.isFinite(amount) || amount <= 0) {
return res.status(400).json({ error: "amount must be a positive number" });
}

const result = await initiateStkPush({
env: MPESA_ENV || "sandbox",
consumerKey: MPESA_CONSUMER_KEY,
consumerSecret: MPESA_CONSUMER_SECRET,
shortCode: MPESA_SHORTCODE,
passKey: MPESA_PASSKEY,
callbackUrl: MPESA_CALLBACK_URL,
amount,
phone,
accountReference,
transactionDesc
});

return res.status(200).json({ success: true, data: result });
} catch (err) {
console.error("STK Push error:", err);
return res.status(500).json({ error: "Internal Server Error", message: String(err.message || err) });
}
};
