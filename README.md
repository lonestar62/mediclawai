# MediclawAI — Marketing Site

**Build Medical AI. Without the IBM Price Tag.**

MediclawAI is a multi-tenant AI orchestration platform for medical practices and medical technology inventors.

## Stack

- **Node.js + Express** — static file server + waitlist API
- **Port:** 3020
- **No framework dependencies** — pure HTML/CSS/JS

## Project Structure

```
mediclawai/
├── server.js           Express static server + /api/waitlist endpoint
├── package.json
├── public/
│   ├── index.html      Marketing landing page
│   ├── css/styles.css  Dark theme styles
│   ├── js/main.js      Form handling + scroll behavior
│   └── favicon.svg
├── mediclawai.service  Systemd service file
├── deploy.sh           Deployment script for fleet-vm
└── waitlist.json       Local waitlist storage (gitignored)
```

## Development

```bash
npm install
npm start
# → http://localhost:3020
```

## Deployment

See [deploy.sh](./deploy.sh) for full deployment instructions.

Target: `fleet-vm` at port 3020, proxied via nginx as `mediclawai.com`.

## Architecture

MediclawAI is proof-first: [Brain3](https://brain.deeptxai.com) is the reference implementation demonstrating the full clinical AI platform in production.

**Patent Pending BAUR-80289** — Selective carry-forward engine, Physician Review Gate, multi-model AI consensus architecture, evidence chain design.

---

© 2026 MediclawAI · [mediclawai.com](https://mediclawai.com)
