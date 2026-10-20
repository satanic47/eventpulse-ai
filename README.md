# 🎉 EventPulse AI — Autonomous Celebration & Event Planner Copilot

[![Tests: 12 Passing](https://img.shields.io/badge/Tests-12%2F12%20Passing-06D6A0?style=for-the-badge&logo=pytest)](tests/)
[![Security: Hardened](https://img.shields.io/badge/Security-Sanitized%20&%20Hardened-8338EC?style=for-the-badge&logo=shield)](SECURITY.md)
[![Accessibility: WCAG 2.1 AA](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-FFB703?style=for-the-badge&logo=w3c)](index.html)
[![License: MIT](https://img.shields.io/badge/License-MIT-3A86FF?style=for-the-badge)](LICENSE)
[![Repo Size: < 3 MB](https://img.shields.io/badge/Repo_Size-%3C_3_MB-FF006E?style=for-the-badge)]()
[![Single Branch: main](https://img.shields.io/badge/Branch-Single_Branch_(main)-06D6A0?style=for-the-badge)]()

> **"Transforming celebration planning chaos into orchestrated moments."**  
> EventPulse AI is an autonomous, context-aware celebration and event planning assistant designed to help users organize **weddings, birthdays, and community events** with dynamic budgets, run-of-show timelines, vendor checklists, and personalized ideas.

---

## 🏆 Challenge Overview & Submission Brief

### 1. Chosen Vertical & Persona
- **Challenge Track:** **[Challenge 5] Celebration & Event Planner**
- **Smart Assistant Persona:** **EventPulse Copilot** — An empathetic, detail-oriented celebration architect and operations coordinator. It eliminates the anxiety of event planning by synthesizing chaotic wishlists into structured, actionable itineraries, dynamic budget allocations, and contingency strategies.

### 2. Approach and Logic
Event planning typically suffers from severe cognitive overload: organizers juggle guest counts, food/beverage formulas, vendor communications, and chaotic schedules. 

EventPulse AI approaches this with **dynamic contextual logic**:
- **Continuous Parameter Pacing:** Adjusting a single slider (e.g. increasing guest count from 100 to 180) dynamically cascades across the entire system:
  - Recalculates itemized budget limits (Venue 30%, Catering 35%, Production 15%, Bar 10%, Decor 5%, Contingency 5%).
  - Adjusts beverage inventory (estimating total drinks, wine bottle cases, beer kegs, and mocktails).
  - Determines staffing ratios (1 bartender per 75 guests, 1 server per 30 guests).
  - Updates venue square footage recommendations.
- **Context-Aware Conversational Copilot:** An intelligent assistant that answers critical operational questions (weather contingencies, budget reductions without compromising experience, and sound arc transitions).

### 3. How the Solution Works
1. **1-Click Presets & Custom Configuration:** Choose between curated celebration archetypes (**Weddings**, **Milestone Birthdays**, and **Community Hackathons**) or define custom parameters.
2. **Dynamic Operations Engine:** Real-time computation breaks down expenditures, monitors cost-per-guest metrics, and computes inventory formulas.
3. **Run-of-Show Timeline Generator:** Creates a synchronized, hour-by-hour operational schedule with specific cues for arrivals, keynote speeches, dinner transitions, cake cuttings, and DJ sets.
4. **Interactive Vendor Checklist & Negotiations:** Interactive 6-point vendor milestone tracker (contract locks, tasting, AV checks, rain contingency) alongside automated email drafts and RSVP announcements.

### 4. Assumptions Made
- **Industry Budget Benchmarks:** Allocations are derived from industry standards (30% venue, 35% food, 15% audio/visual, 10% bar, 5% decor, 5% emergency contingency reserve).
- **Beverage Consumption Model:** Formulated on standard celebration pacing: 2 drinks per guest in the first hour, followed by 1 drink per guest per hour, distributed across 40% wine, 40% beer, and 20% non-alcoholic/mocktails.
- **Single-Branch & Lightweight Design:** Built with zero bulky node_modules dependencies to guarantee a repository footprint under 3 MB (well beneath the 10 MB competition limit).

---

## 🛡️ Enterprise Security & Input Sanitization
- **Strict Sanitization:** Regex-based HTML and script tag stripping on all text inputs (`sanitize_text()`) prevents Stored and Reflected Cross-Site Scripting (XSS).
- **Hardened HTTP Headers:** Attached middleware injecting `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `X-XSS-Protection: 1; mode=block`, and Content-Security-Policy (CSP).
- **Boundary Validation:** Strict Pydantic numeric and string boundaries (`1 <= guests <= 10000`, `$100 <= budget <= $10,000,000`).
- **Security Policy:** Documented in [SECURITY.md](SECURITY.md).

---

## ♿ Accessibility Compliance (WCAG 2.1 AA)
- **Keyboard Navigation:** Full keyboard operability with visible `:focus-visible` golden focus rings and tab order.
- **Screen Reader Support:** Semantic ARIA roles (`role="tablist"`, `role="tab"`, `role="tabpanel"`, `role="region"`, `role="feed"`) and `aria-live="polite"` telemetry announcements.
- **Skip Link:** Direct skip-to-content anchor for screen reader and keyboard accessibility.
- **Form Associations:** Strict `<label for="...">` element associations and accessible range slider descriptions.

---

## 🧪 Automated Testing Suite (12 / 12 Passing)

```bash
# Run test suite with pytest
python -m pytest -v
```

The test suite covers:
- **`tests/test_event_planner.py`:** Budget 100% sum verification, beverage scaling math, wedding pacing, and minimum staffing thresholds.
- **`tests/test_api.py`:** Health check endpoints, plan calculation schema verification, copilot response generation, and HTML serving.
- **`tests/test_security.py`:** Security header validation, XSS sanitization checks, negative guest rejection, and unrealistic budget boundaries.

---

## 🚀 Quickstart & Setup

### Option A: Direct Browser Preview (Instant, Zero Dependencies)
Open `index.html` in any web browser, or visit the live deployment at **[https://satanic47.github.io/eventpulse-ai/](https://satanic47.github.io/eventpulse-ai/)**!

### Option B: Run with Python FastAPI Backend
```bash
# 1. Clone repository
git clone https://github.com/satanic47/eventpulse-ai.git
cd eventpulse-ai

# 2. Install dependencies
pip install -r requirements.txt

# 3. Start server
python app.py
```
Visit **[http://localhost:8000](http://localhost:8000)** in your browser.

---

## 🏗️ Architecture & Project Structure

```
eventpulse-ai/
├── .github/
│   └── workflows/
│       └── test.yml            # Automated CI running test suite on GitHub
├── app.py                      # FastAPI REST API with security middleware
├── requirements.txt            # Minimal lightweight dependencies
├── index.html                  # Accessible standalone dashboard (WCAG 2.1 AA)
├── templates/
│   └── index.html              # Jinja2 template for FastAPI server
├── tests/
│   ├── __init__.py
│   ├── test_event_planner.py   # Unit tests for planning & formulas
│   ├── test_api.py             # Integration tests for REST endpoints
│   └── test_security.py        # Security & boundary validation tests
├── static/
│   ├── css/
│   │   └── style.css           # Modern celebration UI with high-contrast focus
│   └── js/
│       └── app.js              # Real-time event calculation & assistant logic
├── demo/
│   ├── EventPulse_AI_Demo.mp4  # Voiced demo video (Indian English male)
│   ├── screenshot.png          # High-resolution dashboard screenshot
│   └── build_voiced_demo.py    # Automation script to render demo video
├── SECURITY.md                 # Security architecture & vulnerability disclosure
├── LICENSE                     # MIT License
└── README.md                   # Complete documentation
```

---

*Built with ❤️ for the Hack2skill PromptWars Virtual Challenge.*
