"use strict";

const BASE_URLS = {
sandbox: "https://sandbox.safaricom.co.ke",
production: "https://api.safaricom.co.ke"
};

function getBaseUrl(env) {
const key = (env || "sandbox").toLowerCase();
return BASE_URLS[key] || BASE_URLS.sandbox;
}

function toTimestampString(date = new Date()) {
const pad = (n) => String(n).padStart(2, "0");
const yyyy = date.getFullYear();
const MM = pad(date.getMonth() + 1);
const dd = pad(date.getDate());
const HH = pad(date.getHours());
const mm = pad(date.getMinutes());
const ss = pad(date.getSeconds());
return `${yyyy}${MM}${dd}${HH}${mm}${ss}`;
}

function toBase64(str) {
return Buffer.from(str, "utf8").toString("base64");
}

function generatePassword(shortCode, passKey, timestamp) {
return toBase64(`${shortCode}${passKey}${timestamp}`);
}

function normalizePhone(rawPhone) {
if (!rawPhone || typeof rawPhone !== "string") {
throw new Error("Invalid phone");
}
let p = rawPhone.replace(/\s+/g, "").replace(/[^\d+]/g, "");
if (p.startsWith("+")) p = p.slice(1);
if (p.startsWith("0")) p = `254${p.slice(1)}`;
if (p.startsWith("7") && p.length === 9) p = `254${p}`;
if (!/^2547\d{8}$/.test(p)) {
throw new Error("Phone must be in format 2547XXXXXXXX");
}
return p;
}

async function getAccessToken({ consumerKey, consumerSecret, baseUrl }) {
const endpoint = `${baseUrl}/oauth/v1/generate?grant_type=client_credentials`;
const creds = toBase64(`${consumerKey}:${consumerSecret}`);
const res = await fetch(endpoint, {
method: "GET",
headers: {
Authorization: `Basic ${creds}`
}
});
if (!res.ok) {
const text = await res.text();
throw new Error(`OAuth failed (${res.status}): ${text}`);
}
const data = await res.json();
if (!data.access_token) {
throw new Error("OAuth response missing access_token");
}
return data.access_token;
}

async function initiateStkPush({
env = "sandbox",
consumerKey,
consumerSecret,
shortCode,
passKey,
callbackUrl,
amount,
phone,
accountReference = "TEST",
transactionDesc = "Payment"
}) {
const baseUrl = getBaseUrl(env);
const accessToken = await getAccessToken({ consumerKey, consumerSecret, baseUrl });
const timestamp = toTimestampString();
const password = generatePassword(shortCode, passKey, timestamp);
const partyA = normalizePhone(phone);

const payload = {
BusinessShortCode: shortCode,
Password: password,
Timestamp: timestamp,
TransactionType: "CustomerPayBillOnline",
Amount: Number(amount),
PartyA: partyA,
PartyB: Number(shortCode),
PhoneNumber: partyA,
CallBackURL: callbackUrl,
AccountReference: accountReference,
TransactionDesc: transactionDesc
};

const res = await fetch(`${baseUrl}/mpesa/stkpush/v1/processrequest`, {
method: "POST",
headers: {
Authorization: `Bearer ${accessToken}`,
"Content-Type": "application/json"
},
body: JSON.stringify(payload)
});

const text = await res.text();
let data;
try {
data = JSON.parse(text);
} catch (_e) {
throw new Error(`STK push non-JSON response (${res.status}): ${text}`);
}
if (!res.ok) {
throw new Error(`STK push failed (${res.status}): ${text}`);
}
return data;
}

module.exports = {
getBaseUrl,
toTimestampString,
generatePassword,
normalizePhone,
getAccessToken,
initiateStkPush
};
