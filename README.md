# Promptimizer

A minimal prompt optimization tool that helps refine AI prompts for better results. Built with React, TypeScript, and the Gemini API.

**Live:** [prompt.ericmartin.ai](https://prompt.ericmartin.ai)

---

## Features

- **Progressive flow** — Guided steps instead of a cluttered dashboard
- **Smart model suggestions** — Analyzes your prompt and recommends the best AI model
- **Deep refinement** — Optional second-pass optimization for complex prompts
- **Model-specific optimization** — Applies best practices for ChatGPT, Claude, Gemini, and Copilot

---

## Local Development

### Prerequisites

- Node.js 18+
- A [Google AI Studio](https://aistudio.google.com/) API key

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/promptimizer.git
cd promptimizer

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local
```

Edit `.env.local` and add your Gemini API key:

```
API_KEY=your_gemini_api_key_here
```

### Run

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Deployment (Netlify)

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/promptimizer.git
git push -u origin main
```

### 2. Create Netlify Site

1. Log in to [Netlify](https://netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect your GitHub account and select the `promptimizer` repo
4. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Click **"Deploy site"**

### 3. Add Environment Variable

1. Go to **Site settings** → **Environment variables**
2. Add a new variable:
   - **Key:** `VITE_API_KEY`
   - **Value:** Your Gemini API key
3. Trigger a redeploy: **Deploys** → **Trigger deploy** → **Deploy site**

### 4. Custom Domain Setup

To use `prompt.your-site-name.ai`:

**In Netlify:**
1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Enter `prompt.your-site-name.ai`
4. Netlify will show you the required DNS records

**In your DNS provider:**
1. Add a CNAME record:
   - **Type:** CNAME
   - **Name:** prompt
   - **Value:** `[your-site-name].netlify.app`
2. Wait for DNS propagation (usually 5-30 minutes)

**Enable HTTPS:**
1. Back in Netlify → **Domain management** → **HTTPS**
2. Click **"Verify DNS configuration"**
3. Once verified, click **"Provision certificate"**

---

## Project Structure

```
promptimizer/
├── App.tsx              # Main application component (stepped flow)
├── index.html           # HTML entry point with Tailwind config
├── index.tsx            # React entry point
├── constants.ts         # Model definitions and best practices
├── types.ts             # TypeScript type definitions
├── services/
│   └── geminiService.ts # Gemini API integration
├── components/          # Legacy components (not used in new design)
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `API_KEY` | Google Gemini API key | Yes |

---

## Tech Stack

- **Framework:** React 18
- **Build:** Vite
- **Styling:** Tailwind CSS
- **AI:** Google Gemini 3 Pro
- **Icons:** Lucide React
- **Hosting:** Netlify

---

## Credits

Design direction inspired by [Ilya Sutskever's website](https://www.ilya.io/) — minimal, confident, lets the work speak.

Built by [Eric Martin](https://ericmartin.ai)

---

## License

MIT
