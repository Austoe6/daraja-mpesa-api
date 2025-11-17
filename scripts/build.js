"use strict";

const fs = require("fs");
const path = require("path");

const root = process.cwd();
const buildDir = path.join(root, "build");
const sourceIndex = path.join(root, "index.html");
const targetIndex = path.join(buildDir, "index.html");

function ensureDir(p) {
	if (!fs.existsSync(p)) {
		fs.mkdirSync(p, { recursive: true });
	}
}

function copyFile(src, dst) {
	fs.copyFileSync(src, dst);
}

function main() {
	ensureDir(buildDir);
	if (!fs.existsSync(sourceIndex)) {
		// Create a minimal index.html if it doesn't exist
		const html = [
			"<!doctype html>",
			"<html>",
			"<head>",
			'  <meta charset="utf-8" />',
			"  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />",
			"  <title>daraja-mpesa-api</title>",
			"</head>",
			"<body>",
			"  <h1>Daraja M-Pesa API</h1>",
			"  <p>Serverless API is deployed. Try <code>/api/health</code>.</p>",
			"</body>",
			"</html>"
		].join("\n");
		fs.writeFileSync(sourceIndex, html, "utf8");
	}
	copyFile(sourceIndex, targetIndex);
	console.log(`Built to ${buildDir}`);
}

main();


