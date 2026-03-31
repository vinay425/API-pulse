# APIPulse — API Health Monitor

> **"Test fast. Ship confident."**

Production-grade API health testing and monitoring dashboard for engineering teams. Zero dependencies. Fully installable PWA.

---

## ✨ Features

| Feature | Details |
|---|---|
| **API Definitions** | Upload a JSON file or load the built-in demo |
| **Dynamic Clients** | Fetch clients from any API — extracts all `id` fields recursively |
| **Manual Client** | Type a client name directly as fallback |
| **Environments** | One-click dev / staging / prod, or type a custom env |
| **Placeholder URLs** | `{client}` and `{env}` replaced in every URL at runtime |
| **Parallel Execution** | Configurable concurrency 1–10, Stop + Retry Failed controls |
| **Smart Status** | 🟢 SUCCESS · 🟠 LOGICAL FAIL · 🔴 FAILURE |
| **Live Progress Bar** | Sticky segmented bar — green/orange/red fills per API in real time |
| **Result Cards** | Status, HTTP code, response time, collapsible JSON body per API |
| **Filters** | All / Passed / Logical Fail / Failed / Slow (>2s) |
| **Health Score** | Animated SVG ring — Excellent / Healthy / Degraded / Critical |
| **PDF Report** | Health score, KPI strip, bar chart, full table, issue details, slow list |
| **Dark / Light mode** | Toggle in header |
| **PWA** | Installable on Mac, Windows, iOS, Android — works offline |

---

## 📂 File Structure

```
apipulse/
├── index.html        ← Complete app (UI + logic, no build step)
├── manifest.json     ← PWA manifest
├── sw.js             ← Service worker (offline cache + fallback)
├── favicon.svg       ← Browser favicon
├── icon-192.svg      ← PWA home screen icon
├── icon-512.svg      ← PWA splash / install icon
├── sample-apis.json  ← Example API definitions
└── README.md         ← This file
```

---

## 🚀 Running Locally

Service workers require HTTP (not `file://`). Use any local server:

```bash
# Option 1 — Node serve (recommended)
npx serve .

# Option 2 — Python
python3 -m http.server 3000

# Option 3 — http-server
npx http-server . -p 3000 --cors
```

Open: **http://localhost:3000**

---

## 🌐 Deployment

Drop the folder into any static host — no build, no bundler.

| Platform | Steps |
|---|---|
| **Vercel** | `vercel deploy` or drag-drop folder in dashboard |
| **Netlify** | Drag-drop folder into Netlify Drop |
| **GitHub Pages** | Push repo, enable Pages on `main` branch |
| **AWS S3** | Upload files, enable static website hosting |
| **Nginx / Apache** | Copy to web root, no rewrites needed |

> HTTPS required for PWA install and service workers in production.

---

## 📋 API Definitions Format

```json
[
  {
    "name": "GetUserProfile",
    "url": "https://api.{env}.example.com/{client}/users/profile"
  },
  {
    "name": "ListOrders",
    "url": "https://api.{env}.example.com/{client}/orders"
  }
]
```

### Placeholders

| Placeholder | Replaced with |
|---|---|
| `{client}` | Selected or manually entered client name |
| `{env}` | Selected environment (dev / staging / prod / custom) |

---

## ✅ Status Classification

| Status | Condition |
|---|---|
| 🟢 **SUCCESS** | HTTP 2xx, no error indicators in response body |
| 🟠 **LOGICAL FAIL** | HTTP 200 but body contains `errors`, `error`, or `exception` |
| 🔴 **FAILURE** | HTTP 4xx/5xx, network error, or timeout (12s default) |

---

## 📊 PDF Report Contents

1. **Header** — Branding, client, environment, timestamp
2. **Health Score Band** — Score %, ring gauge, label, summary sentence
3. **KPI Strip** — Total · Passed · Logical · Failed · Avg Time · Slowest
4. **Response Time Chart** — SVG bar chart per API, colour-coded
5. **Full Results Table** — All APIs: status badge, HTTP code, time, body preview
6. **Issues Section** — Expanded detail cards for every failed/logical API
7. **Slow APIs Section** — APIs exceeding 2s response time

> Report opens in a new tab. Use **Ctrl/Cmd+P → Save as PDF** to download.

---

## 🔌 Client Fetch — ID Extraction

APIPulse recursively walks the entire JSON response and collects every `"id"` field at any depth:

```json
// Any response shape works:
{ "data": { "clients": [ {"id": "acme"}, {"id": "beta"} ] } }
// → Dropdown: acme · beta
```

---

## ⚙️ Configuration

| Setting | Default | Where to change |
|---|---|---|
| Concurrency | 5 | Slider in left panel |
| Request timeout | 12 000 ms | `fetchWithTimeout(..., 12000)` in `callAPI()` |
| Slow threshold | 2 000 ms | `state.slowThreshold` in JS state object |

---

## 📱 PWA Installation

**Desktop (Chrome/Edge):** Click ⊕ in address bar → Install APIPulse

**iOS (Safari):** Share button → Add to Home Screen

**Android (Chrome):** Menu ⋮ → Add to Home Screen

The service worker caches the app shell on first load — opens instantly offline.

---

## 🏗️ Architecture

```
index.html
├── CSS variables    Light/dark theme tokens
├── Header           Sticky top bar + global progress bar
├── Left panel       Steps 1–4 (upload, client, env, run) + concurrency
├── Right panel      Summary KPIs, health ring, filter tabs, API cards
└── JavaScript
    ├── State        Single source of truth
    ├── File upload  Parse, validate, preview schema
    ├── Client fetch Recursive ID extraction from any JSON
    ├── Execution    Parallel runner, stop, retry
    ├── Progress     Sticky segmented bar with live counts
    ├── PDF Report   Full HTML report → browser print → PDF
    └── PWA          Service worker registration

sw.js
├── install          Cache static assets
├── activate         Purge old caches
└── fetch            Cache-first (static) · Network-first (APIs) · Offline fallback
```

---

## 🎨 Design Tokens

| Token | Light | Dark |
|---|---|---|
| `--bg` | `#f6f7fb` | `#0c0d12` |
| `--surface` | `#ffffff` | `#13151f` |
| `--border` | `#e2e5ef` | `#1e2130` |
| `--text` | `#0f1117` | `#e8eaf0` |
| `--muted` | `#6b7280` | `#5a6078` |
| `--accent` | `#2563eb` | `#3b82f6` |

**Fonts:** Nunito Sans (UI) · DM Mono (code/data)

---

## 🔒 Security Notes

- All requests are made directly from the browser — no backend or proxy
- No credentials or tokens are stored by APIPulse
- CORS must be permitted on target APIs from your APIPulse origin
- For internal APIs, run APIPulse on the same network

---

## 🛠️ Customisation

**Add a custom environment button:**
```html
<button class="btn btn-ghost btn-sm env-btn" onclick="selectEnv(this,'uat')">uat</button>
```

**Change request method or add auth headers** (edit `callAPI()` in index.html):
```js
const r = await fetchWithTimeout(url, {
  method: 'POST',
  headers: { 'Authorization': 'Bearer TOKEN', 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: '{ user { id } }' })
}, 12000);
```

**Adjust timeout:**
```js
const r = await fetchWithTimeout(url, {}, 20000); // 20s
```

---

## 🏷️ Brand

| | |
|---|---|
| **Name** | APIPulse |
| **Tagline** | *Test fast. Ship confident.* |
| **Tone** | Technical authority meets developer ergonomics |
| **Fonts** | Nunito Sans + DM Mono |
| **Primary** | `#2563eb` blue |
| **Success** | `#22c55e` green |
| **Warning** | `#f97316` orange |
| **Error** | `#ef4444` red |

---

## 📄 License

MIT — free to use, modify, and distribute.

---

*Pure HTML · Tailwind CSS · Vanilla JS · No frameworks · No build step*
