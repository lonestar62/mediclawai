const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3020;
const WAITLIST_FILE = path.join(__dirname, 'waitlist.json');

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ensure waitlist file exists
if (!fs.existsSync(WAITLIST_FILE)) {
  fs.writeFileSync(WAITLIST_FILE, JSON.stringify([], null, 2));
}

// POST /api/waitlist — save early access request
app.post('/api/waitlist', (req, res) => {
  const { name, email, organization, building } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }

  const entry = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    organization: (organization || '').trim(),
    building: (building || '').trim(),
    source: req.get('referer') || 'direct'
  };

  let waitlist = [];
  try {
    waitlist = JSON.parse(fs.readFileSync(WAITLIST_FILE, 'utf8'));
  } catch (e) {
    waitlist = [];
  }

  // Prevent duplicate emails
  const exists = waitlist.some(w => w.email === entry.email);
  if (exists) {
    return res.status(200).json({ success: true, message: "You're already on our list — we'll be in touch." });
  }

  waitlist.push(entry);
  fs.writeFileSync(WAITLIST_FILE, JSON.stringify(waitlist, null, 2));

  console.log(`[waitlist] New signup: ${entry.name} <${entry.email}> — ${entry.organization}`);
  res.status(201).json({ success: true, message: "Thank you — we'll be in touch." });
});

// Catch-all → index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`MediclawAI marketing site running on port ${PORT}`);
});
