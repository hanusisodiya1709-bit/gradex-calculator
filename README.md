# 🎓 GRADEX | Student Grade Calculator (Prototype & Deployment Package)

> **JECRC Foundation • Internship Demonstration Project (Slide 10/15)**  
> Built with Python & Modern Responsive Web Architecture.

---

## ⚡ Quick Start & Instant Deployment

### Option 1: Instant Cloud Deployment (Free & Ready in 30 Seconds)
1. **Netlify Drop (Easiest - No install needed):**
   - Open [app.netlify.com/drop](https://app.netlify.com/drop) in your browser.
   - Drag and drop this folder (`gradex-calculator`) into the drop zone.
   - Netlify will immediately generate a live HTTPS URL (e.g., `https://gradex-jecrc.netlify.app`) you can share in your presentation!

2. **Vercel:**
   - Run `npx vercel` in this folder, or import the GitHub repository on [vercel.com](https://vercel.com).

3. **GitHub Pages:**
   - Push this directory to a GitHub repository.
   - Go to **Settings > Pages > Source: Deploy from branch > main / root**.

---

### Option 2: Run Locally on Your Machine

#### A. Web Prototype (Browser Interface)
- **Method 1:** Double-click [`run_web.bat`](file:///C:/Users/acer/.gemini/antigravity/scratch/gradex-calculator/run_web.bat)  
  *or* run in PowerShell / CMD:
  ```powershell
  python server.py
  ```
  This opens `http://localhost:5000` automatically in your browser.

- **Method 2:** Double-click [`index.html`](file:///C:/Users/acer/.gemini/antigravity/scratch/gradex-calculator/index.html) to open directly in Chrome/Edge.

#### B. Terminal Application (Python CLI)
- Double-click [`run_cli.bat`](file:///C:/Users/acer/.gemini/antigravity/scratch/gradex-calculator/run_cli.bat)  
  *or* run:
  ```powershell
  python gradex.py
  ```

---

## 📂 Project Structure

```
gradex-calculator/
├── index.html           # Modern interactive web prototype with presentation tabs
├── style.css            # Academic JECRC styling, responsive design & print layout
├── app.js               # Client-side calculation engine, CSV generator & storage
├── gradex.py            # Standalone Python CLI application (pure Python 3.8+)
├── server.py            # Local zero-dependency Python web server
├── run_web.bat          # 1-click Windows launcher for Web App
├── run_cli.bat          # 1-click Windows launcher for Python CLI
├── PRESENTATION.md      # Verbal presentation script & Viva questions/answers
├── netlify.toml         # Cloud deployment config for Netlify
├── vercel.json          # Cloud deployment config for Vercel
└── README.md            # Documentation & setup guide
```

---

## 🎯 4-Stage Architecture (Slide 10/15)

1. **Input (Marks):** Validation, exception handling (`try-except`), dictionaries.
2. **Calculation:** Total sum, percentage calculation, SGPA (10-point scale).
3. **Grade Determination:** `if-elif-else` ladder + backlog detection (min 40 marks/subject).
4. **Result & Report:** Printable official marksheet, session leaderboard, CSV export.
