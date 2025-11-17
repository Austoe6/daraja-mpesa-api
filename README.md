## Daraja M-Pesa STK Push API (Vercel)

Serverless API (Node.js on Vercel) for initiating Safaricom Daraja STK Push.

### Endpoints
- `POST /api/stk-push` — Initiates an STK push to a phone number.
- `POST /api/callback`  Receives M-Pesa callback (set this as your Daraja callback URL).
- `GET /api/health` — Health check.

### Environment Variables
Create environment variables in Vercel (Project Settings  Environment Variables) with the following keys:

- `MPESA_ENV` — `sandbox` or `production`
- `MPESA_CONSUMER_KEY`
- `MPESA_CONSUMER_SECRET`
- `MPESA_SHORTCODE`  Paybill/Till (for Lipa na M-Pesa Online)
- `MPESA_PASSKEY`  Lipa na M-Pesa Online passkey
- `MPESA_CALLBACK_URL`  Public URL to `https://<your-vercel-domain>/api/callback`

You can also reference `env.example` for local dev values.

### Local Development
1. Install Vercel CLI: `npm i -g vercel`
2. From the project root:
   - `vercel dev`
3. Use your local tunnel or set `MPESA_CALLBACK_URL` to your deployed Vercel URL during live testing.

### Request Example
POST `https://<your-vercel-domain>/api/stk-push`

```bash
curl -X POST "https://<your-vercel-domain>/api/stk-push" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "2547XXXXXXXX",
    "amount": 10
  }'
```

Optional fields:
```json
{
  "accountReference": "MY-ORDER-123",
  "transactionDesc": "Checkout payment"
}
```

### Callback Payload
Safaricom posts the result to `/api/callback`. This API acknowledges with `{ "ResultCode": 0, "ResultDesc": "Accepted" }`.

### Deploying to Vercel
1. Push this repository to GitHub.
2. Import the repo in Vercel and set the environment variables listed above.
3. Deploy.

### Notes
- Uses Node 18 runtime on Vercel and native `fetch`.
- Phone numbers are normalized to `2547XXXXXXXX`; inputs like `07XXXXXXXX` or `+2547XXXXXXXX` are supported.
- For production, change `MPESA_ENV=production`.

### License
MIT
