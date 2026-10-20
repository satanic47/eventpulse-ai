# 🎉 EventPulse AI — Autonomous Celebration & Event Planner Copilot

[![Hack2skill PromptWars](https://img.shields.io/badge/Hack2skill-PromptWars_Virtual-8338EC?style=for-the-badge&logo=google)](https://hack2skill.com)
[![Challenge](https://img.shields.io/badge/Track-%5BChallenge_5%5D_Celebration_&_Event_Planner-FFB703?style=for-the-badge)](https://hack2skill.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-06D6A0?style=for-the-badge)](LICENSE)
[![Repo Size: < 2 MB](https://img.shields.io/badge/Repo_Size-%3C_2_MB-3A86FF?style=for-the-badge)]()
[![Single Branch: main](https://img.shields.io/badge/Branch-Single_Branch_(main)-FF006E?style=for-the-badge)]()

> **"Transforming event planning chaos into orchestrated celebrations."**  
> EventPulse AI is an autonomous, context-aware celebration and event planning assistant designed to streamline budgeting, vendor coordination, drink calculations, and minute-by-minute run-of-show itineraries through generative AI and dynamic contextual logic.

---

## 🏆 Challenge Overview & Submission Brief

### 1. Chosen Vertical & Persona
- **Challenge Track:** **[Challenge 5] Celebration & Event Planner**
- **Smart Assistant Persona:** **EventPulse Copilot** — An empathetic, detail-oriented celebration architect and operations coordinator. It eliminates the anxiety of event planning by synthesizing chaotic wishlists into structured, actionable itineraries, dynamic budget allocations, and contingency strategies.

### 2. Approach and Logic
Event planning typically suffers from severe cognitive overload: organizers juggle guest counts, food/beverage formulas, vendor communications, and chaotic schedules. 

EventPulse AI approaches this with **dynamic contextual logic**:
- **Continuous Parameter Pacing:** Instead of static forms, adjusting a single slider (e.g. increasing guest count from 100 to 180) dynamically cascades across the entire system:
  - Recalculates itemized budget limits (Venue 30%, Catering 35%, Production 15%, Bar 10%, Decor 5%, Contingency 5%).
  - Adjusts beverage inventory (estimating total drinks, wine bottle cases, beer kegs, and mocktails).
  - Determines staffing ratios (1 bartender per 75 guests, 1 server per 30 guests).
  - Updates venue square footage recommendations.
- **Context-Aware Conversational Copilot:** An intelligent assistant that answers critical operational questions (weather contingencies, budget reductions without compromising experience, and sound arc transitions).

### 3. How the Solution Works
1. **1-Click Presets & Custom Configuration:** Choose between curated celebration archetypes (National Hackathon Gala, Golden Hour Sunset Wedding, Series A Launch Party, Retro 30th Birthday) or define custom parameters.
2. **Dynamic Operations Engine:** Real-time computation breaks down expenditures, monitors cost-per-guest metrics, and computes inventory formulas.
3. **Run-of-Show Timeline Generator:** Creates a synchronized, hour-by-hour operational schedule with specific cues for arrivals, keynote speeches, dinner transitions, cake cuttings, and DJ sets.
4. **Vendor Negotiation & Invitation Suite:** Generates customized vendor inquiry emails and tailored WhatsApp/Email RSVP announcements with 1-click clipboard copy.

### 4. Assumptions Made
- **Industry Budget Benchmarks:** Allocations are derived from industry standards (30% venue, 35% food, 15% audio/visual, 10% bar, 5% decor, 5% emergency contingency reserve).
- **Beverage Consumption Model:** Formulated on standard celebration pacing: 2 drinks per guest in the first hour, followed by 1 drink per guest per hour, distributed across 40% wine, 40% beer, and 20% non-alcoholic/mocktails.
- **Single-Branch & Lightweight Design:** Built with zero bulky node_modules dependencies to guarantee a repository footprint under 2 MB (well beneath the 10 MB competition limit).

---

## 🚀 Quickstart & Setup

### Option A: Direct Browser Preview (Instant, Zero Dependencies)
Simply open `index.html` in any web browser!

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
├── app.py                      # FastAPI REST API & calculation engine
├── requirements.txt            # Minimal lightweight dependencies
├── index.html                  # Standalone interactive dashboard (Single Page App)
├── templates/
│   └── index.html              # Jinja2 template for FastAPI server
├── static/
│   ├── css/
│   │   └── style.css           # Modern dark glassmorphism celebration UI
│   └── js/
│       └── app.js              # Real-time event calculation & assistant logic
├── demo/
│   └── generate_demo_video.py  # Automation script to render demo video
├── vercel.json                 # Serverless deployment configuration
└── README.md                   # Complete documentation
```

---

## 💡 Why This Solution Stands Out
- **High Impact Alignment:** 100% purpose-built for `[Challenge 5] Celebration & Event Planner`.
- **Dynamic Decision Making:** Live recalculations replace static guesswork with validated event formulas.
- **Practical & Usable:** Ready to use for real-world celebrations with 1-click vendor email copy and RSVP generators.
- **Clean & Fast:** Zero bloat, responsive on mobile and desktop, under 2 MB repository size.

---

*Built with ❤️ for the Hack2skill PromptWars Virtual Challenge.*
