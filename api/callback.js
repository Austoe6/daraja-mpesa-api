"use strict";

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
const callback = req.body || {};
console.log("Daraja Callback:", JSON.stringify(callback, null, 2));
return res.status(200).json({
ResultCode: 0,
ResultDesc: "Accepted"
});
} catch (err) {
console.error("Callback handling error:", err);
return res.status(200).json({
ResultCode: 0,
ResultDesc: "Accepted"
});
}
};
