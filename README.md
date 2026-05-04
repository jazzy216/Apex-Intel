# APEX INTEL — Deploy Guide

## Folder Structure
```
apex-intel/
├── api/
│   └── rankings.js      ← Vercel serverless proxy (API key lives here server-side)
├── public/
│   └── index.html       ← The dashboard
├── vercel.json          ← Routing config
└── README.md
```

## Steps to Deploy

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "apex intel init"
git remote add origin https://github.com/YOUR_USERNAME/apex-intel.git
git push -u origin main
```

### 2. Import to Vercel
- Go to vercel.com → Add New Project → Import your GitHub repo
- Framework Preset: **Other**
- Root Directory: leave as `/`
- Click Deploy

### 3. Add API Key in Vercel (NOT in code)
- Vercel Dashboard → Your Project → Settings → Environment Variables
- Add:
  - Name:  `ANTHROPIC_API_KEY`
  - Value: `sk-ant-...your key...`
  - Environment: Production + Preview + Development
- Click Save

### 4. Redeploy
- Vercel Dashboard → Deployments → Click the 3 dots on latest → Redeploy
- (Environment variables require a redeploy to take effect)

## Why This Works
The browser calls `/api/rankings` (your own server).
Your server calls Anthropic with the key from env vars.
The API key never touches the browser — CORS issue solved, key stays secret.

## .gitignore
Make sure this is in your .gitignore — never commit secrets:
```
.env
.env.local
node_modules/
```
