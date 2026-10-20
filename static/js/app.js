/**
 * EventPulse AI - Autonomous Celebration & Event Planner Copilot
 * Hack2skill PromptWars Virtual Challenge 5
 */

// State
let eventState = {
  title: "Hackathon Afterparty & Awards Gala",
  type: "hackathon",
  guests: 150,
  budget: 12000,
  durationHours: 5,
  vibe: "energetic",
  alcoholRatio: 70,
  dietaryVegRatio: 40,
  venueType: "industrial_loft",
  timeline: [],
  vendors: []
};

// Preset Definitions
const EVENT_PRESETS = {
  hackathon: {
    title: "National Hackathon Gala & Tech Celebration",
    type: "hackathon",
    guests: 180,
    budget: 15000,
    durationHours: 6,
    vibe: "cyberpunk_neon",
    alcoholRatio: 60,
    dietaryVegRatio: 45,
    venueType: "tech_hub_atrium",
    description: "High-energy awards ceremony with live synth music, sponsor booths, and late-night pizza."
  },
  wedding: {
    title: "Golden Hour Sunset Wedding & Reception",
    type: "wedding",
    guests: 120,
    budget: 35000,
    durationHours: 7,
    vibe: "luxury_romantic",
    alcoholRatio: 80,
    dietaryVegRatio: 30,
    venueType: "botanical_glasshouse",
    description: "Champagne welcome, acoustic string quartet, gourmet seated dinner, and sparkler farewell."
  },
  launch: {
    title: "Series A Milestone & Product Launch Party",
    type: "launch",
    guests: 90,
    budget: 20000,
    durationHours: 4,
    vibe: "modern_executive",
    alcoholRatio: 75,
    dietaryVegRatio: 35,
    venueType: "skyline_rooftop",
    description: "Keynote presentation, signature branded cocktails, VIP investor lounge, and media photo wall."
  },
  birthday: {
    title: "Neon Retro 30th Birthday Celebration",
    type: "birthday",
    guests: 65,
    budget: 6500,
    durationHours: 5,
    vibe: "retro_funk",
    alcoholRatio: 85,
    dietaryVegRatio: 25,
    venueType: "vintage_speakeasy",
    description: "Custom cocktail menu, retro arcade games, custom neon photo booth, and dessert bar."
  }
};

// Tab Switching
function switchTab(tabId) {
  document.querySelectorAll(".tab-content").forEach(el => el.classList.remove("active"));
  document.querySelectorAll(".tab-btn").forEach(el => el.classList.remove("active"));
  
  const targetContent = document.getElementById(tabId);
  if (targetContent) targetContent.classList.add("active");

  const targetBtn = document.querySelector(`[data-tab="${tabId}"]`);
  if (targetBtn) targetBtn.classList.add("active");
}

// Load Preset
function loadPreset(key) {
  const p = EVENT_PRESETS[key];
  if (!p) return;

  eventState = { ...eventState, ...p };

  // Update Form Inputs
  document.getElementById("event-title-input").value = p.title;
  document.getElementById("event-type-select").value = p.type;
  document.getElementById("guests-slider").value = p.guests;
  document.getElementById("guests-display").innerText = p.guests;
  document.getElementById("budget-slider").value = p.budget;
  document.getElementById("budget-display").innerText = `$${p.budget.toLocaleString()}`;
  document.getElementById("duration-slider").value = p.durationHours;
  document.getElementById("duration-display").innerText = `${p.durationHours} hrs`;

  recalculateAll();
}

// Dynamic Recalculation Engine
function recalculateAll() {
  const budget = parseFloat(document.getElementById("budget-slider").value);
  const guests = parseInt(document.getElementById("guests-slider").value);
  const duration = parseInt(document.getElementById("duration-slider").value);
  const title = document.getElementById("event-title-input").value || "Grand Celebration";

  eventState.budget = budget;
  eventState.guests = guests;
  eventState.durationHours = duration;
  eventState.title = title;

  const costPerGuest = Math.round(budget / guests);

  // Update Telemetry Header
  document.getElementById("header-budget-stat").innerText = `$${budget.toLocaleString()}`;
  document.getElementById("header-guests-stat").innerText = guests;
  document.getElementById("header-cpg-stat").innerText = `$${costPerGuest}`;

  // Calculate Breakdown
  const venue = Math.round(budget * 0.30);
  const catering = Math.round(budget * 0.35);
  const production = Math.round(budget * 0.15);
  const beverage = Math.round(budget * 0.10);
  const decor = Math.round(budget * 0.05);
  const contingency = Math.round(budget * 0.05);

  document.getElementById("alloc-venue-val").innerText = `$${venue.toLocaleString()} (30%)`;
  document.getElementById("alloc-catering-val").innerText = `$${catering.toLocaleString()} (35%)`;
  document.getElementById("alloc-prod-val").innerText = `$${production.toLocaleString()} (15%)`;
  document.getElementById("alloc-bev-val").innerText = `$${beverage.toLocaleString()} (10%)`;
  document.getElementById("alloc-decor-val").innerText = `$${decor.toLocaleString()} (5%)`;
  document.getElementById("alloc-cont-val").innerText = `$${contingency.toLocaleString()} (5%)`;

  // Beverage math
  const totalDrinks = guests * duration * 1.5;
  const wineBottles = Math.round((totalDrinks * 0.4) / 5);
  const beerCans = Math.round(totalDrinks * 0.4);
  const mocktails = Math.round(totalDrinks * 0.2);

  document.getElementById("bev-total-drinks").innerText = Math.round(totalDrinks);
  document.getElementById("bev-wine-bottles").innerText = wineBottles;
  document.getElementById("bev-beer-cases").innerText = `${Math.ceil(beerCans / 24)} cases (${beerCans} cans)`;
  document.getElementById("bev-mocktails").innerText = `${mocktails} servings`;

  // Generate Dynamic Timeline
  generateTimeline();

  // Generate Vendor Inquiry
  generateVendorDrafts();
}

// Generate Dynamic Timeline
function generateTimeline() {
  const container = document.getElementById("timeline-container");
  if (!container) return;

  const hours = eventState.durationHours;
  const type = eventState.type;

  let milestones = [];

  if (type === "hackathon") {
    milestones = [
      { time: "18:00 - 18:30", title: "Doors Open & Neon Badge Check-In", desc: "Welcome drinks, sponsor expo open, DJ warm-up set." },
      { time: "18:30 - 19:15", title: "Opening Remarks & Finalist Demos", desc: "Keynote address, top 5 teams live 3-minute pitches on main stage." },
      { time: "19:15 - 20:30", title: "Catering Dinner & Networking", desc: "Buffet dinner stations open, cocktail hour, photo wall active." },
      { time: "20:30 - 21:15", title: "Trophy Ceremony & Prize Distribution", desc: "Announcement of category winners, sponsor track awards, confetti blast." },
      { time: "21:15 - 23:30", title: "Afterparty DJ Set & Synth Celebration", desc: "Live music, midnight dessert bar, retro gaming tournaments." },
      { time: "23:30 - 00:00", title: "Curfew & Swag Bag Handout", desc: "Closing music, attendee farewell, venue load-out." }
    ];
  } else if (type === "wedding") {
    milestones = [
      { time: "16:00 - 16:30", title: "Guest Arrival & Welcome Champagne", desc: "Acoustic strings play as guests are seated at the gazebo." },
      { time: "16:30 - 17:15", title: "Vows & Ceremony", desc: "Processional, ring exchange, and celebratory recessional." },
      { time: "17:15 - 18:30", title: "Golden Hour Cocktail Reception", desc: "Passed hors d'oeuvres, bride & groom portrait photography." },
      { time: "18:30 - 20:15", title: "Grand Entrance & Seated Dinner", desc: "First dance, heartfelt toasts, 3-course plated dinner." },
      { time: "20:15 - 20:45", title: "Cake Cutting & Dessert Table", desc: "Champagne toast and artisan dessert buffet." },
      { time: "20:45 - 23:00", title: "Open Dance Floor & Sparkler Send-Off", desc: "Live party band, late-night sliders, outdoor sparkler exit." }
    ];
  } else if (type === "launch") {
    milestones = [
      { time: "17:00 - 17:45", title: "VIP Investor & Media Reception", desc: "Signature branded cocktails, press wall check-in." },
      { time: "17:45 - 18:30", title: "Keynote & Live Product Reveal", desc: "Founder showcase, live product demo video, customer testimonials." },
      { time: "18:30 - 20:00", title: "Interactive Experience Stations", desc: "Hands-on demo booths, heavy appetizers, open networking." },
      { time: "20:00 - 21:00", title: "Celebratory Toast & Executive Mixer", desc: "Leadership remarks, team celebration, and gift boxes." }
    ];
  } else {
    milestones = [
      { time: "19:00 - 19:45", title: "Welcome Drinks & Polaroid Photo Wall", desc: "Guests arrive, craft cocktails served, retro playlist playing." },
      { time: "19:45 - 21:00", title: "Gourmet Bites & Trivia Game", desc: "Interactive friend trivia, shared platters, arcade stations." },
      { time: "21:00 - 21:30", title: "Birthday Cake Cutting & Champagne", desc: "Singing, toasts, custom birthday cake presentation." },
      { time: "21:30 - 00:00", title: "Dance Party & Late Night Pizza", desc: "DJ set, glow sticks, late night food delivery." }
    ];
  }

  container.innerHTML = milestones.map(m => `
    <div class="timeline-item">
      <div class="timeline-dot"></div>
      <div class="timeline-card">
        <span class="timeline-time">${m.time}</span>
        <h4 class="timeline-title">${m.title}</h4>
        <p class="timeline-desc">${m.desc}</p>
      </div>
    </div>
  `).join("");
}

// Generate Vendor Inquiry Draft
function generateVendorDrafts() {
  const title = eventState.title;
  const guests = eventState.guests;
  const budget = eventState.budget;
  const cateringBudget = Math.round(budget * 0.35);

  const draft = `Subject: Catering & Event Inquiry: ${title} (${guests} Guests)

Dear Catering Events Team,

I am planning our upcoming event, "${title}", for approximately ${guests} attendees. 

We are targeting a total food & service allocation of roughly $${cateringBudget.toLocaleString()} ($${Math.round(cateringBudget / guests)}/guest). Our requirements include:
- A mix of passed appetizers and main stations.
- Dietary split: ~${eventState.dietaryVegRatio}% vegetarian/plant-based options.
- Efficient flow for a ${eventState.durationHours}-hour event schedule.

Could you share your current seasonal menus and availability for this date? We look forward to exploring options.

Warm regards,
Event Operations Team`;

  const elem = document.getElementById("vendor-email-draft");
  if (elem) elem.value = draft;

  const rsvp = `🎉 You're Invited: ${title}!

Join us for an unforgettable celebration featuring live music, incredible food, and great company!
📍 Date & Location: TBA (Sent upon RSVP)
👥 Expected Guests: ${guests}
⏱ Schedule: ${eventState.durationHours} Hours of celebration

RSVP now to reserve your spot: https://eventpulse-ai.app/rsvp/${encodeURIComponent(title.toLowerCase().replace(/\\s+/g, '-'))}`;

  const rsvpElem = document.getElementById("rsvp-invite-draft");
  if (rsvpElem) rsvpElem.value = rsvp;
}

// Copy to Clipboard Helper
function copyText(elemId, btnId) {
  const el = document.getElementById(elemId);
  if (!el) return;
  navigator.clipboard.writeText(el.value || el.innerText);
  
  const btn = document.getElementById(btnId);
  if (btn) {
    const oldText = btn.innerText;
    btn.innerText = "✓ Copied!";
    setTimeout(() => { btn.innerText = oldText; }, 2000);
  }
}

// Chat Assistant Copilot
function sendChatMessage() {
  const input = document.getElementById("chat-input");
  const msg = input.value.trim();
  if (!msg) return;

  const chatContainer = document.getElementById("chat-messages");

  // User Bubble
  const userBubble = document.createElement("div");
  userBubble.className = "chat-bubble user";
  userBubble.innerText = msg;
  chatContainer.appendChild(userBubble);
  input.value = "";

  // Auto-scroll
  chatContainer.scrollTop = chatContainer.scrollHeight;

  // Bot Response Logic
  setTimeout(() => {
    const botBubble = document.createElement("div");
    botBubble.className = "chat-bubble bot";
    botBubble.innerHTML = generateAssistantReply(msg);
    chatContainer.appendChild(botBubble);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }, 450);
}

function generateAssistantReply(query) {
  const q = query.toLowerCase();
  const guests = eventState.guests;
  const budget = eventState.budget;

  if (q.includes("rain") || q.includes("weather")) {
    return `<strong>☔ Rain Contingency Plan:</strong> For ${guests} guests, ensure your venue contract includes a 24-hour tenting lock or indoor room flip option. Designate the cocktail area as a covered terrace backup.`;
  }
  if (q.includes("cut") || q.includes("save") || q.includes("budget")) {
    const cutAmount = Math.round(budget * 0.15);
    return `<strong>💡 Smart Budget Optimization (-$${cutAmount.toLocaleString()}):</strong><br>1. Switch from plated dinner to gourmet chef stations (saves ~18%).<br>2. Limit open bar to beer, wine, and 2 signature cocktails instead of top-shelf open bar (saves ~25% on alcohol).<br>3. Leverage venue lighting instead of external floral rentals.`;
  }
  if (q.includes("alcohol") || q.includes("drink") || q.includes("wine") || q.includes("beer")) {
    return `<strong>🍸 Drink Formula (${eventState.durationHours} hrs for ${guests} guests):</strong><br>Plan on 2 drinks in Hour 1, then 1 drink/hour thereafter. Total estimated: <strong>${Math.round(guests * (eventState.durationHours + 1))} drinks</strong> (${Math.round(guests * 0.35)} wine bottles, ${Math.ceil((guests * 2.5) / 24)} beer cases).`;
  }
  if (q.includes("dj") || q.includes("music") || q.includes("vibe")) {
    return `<strong>🎵 Sound & Atmosphere:</strong> Recommend transitioning from 90s lounge/synth during guest arrival to upbeat nu-disco during dinner, peaking with high-energy house & pop hits for the final 90 minutes.`;
  }

  return `<strong>✨ EventPulse Recommendation:</strong> Based on your <em>${eventState.title}</em> for ${guests} guests, your current pacing and resource allocation are well balanced. Would you like me to adjust the timeline, optimize vendor allocations, or draft an announcement?`;
}

// Checklist Progress Counter
function updateChecklistProgress() {
  const checkboxes = document.querySelectorAll("#vendor-checklist-container input[type='checkbox']");
  if (!checkboxes.length) return;
  const total = checkboxes.length;
  const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
  const badge = document.getElementById("checklist-progress-badge");
  if (badge) {
    badge.innerText = `${checked} / ${total} Completed`;
    badge.style.color = checked === total ? "var(--emerald)" : "var(--gold)";
  }
}

// Initial Setup
document.addEventListener("DOMContentLoaded", () => {
  updateChecklistProgress();
  // Preset click handlers
  document.querySelectorAll(".preset-card").forEach(card => {
    card.addEventListener("click", () => {
      loadPreset(card.getAttribute("data-preset"));
    });
  });

  // Slider Listeners
  document.getElementById("guests-slider").addEventListener("input", (e) => {
    document.getElementById("guests-display").innerText = e.target.value;
    recalculateAll();
  });

  document.getElementById("budget-slider").addEventListener("input", (e) => {
    document.getElementById("budget-display").innerText = `$${parseInt(e.target.value).toLocaleString()}`;
    recalculateAll();
  });

  document.getElementById("duration-slider").addEventListener("input", (e) => {
    document.getElementById("duration-display").innerText = `${e.target.value} hrs`;
    recalculateAll();
  });

  document.getElementById("event-title-input").addEventListener("input", recalculateAll);
  document.getElementById("event-type-select").addEventListener("change", (e) => {
    eventState.type = e.target.value;
    recalculateAll();
  });

  // Chat enter listener
  document.getElementById("chat-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendChatMessage();
  });

  // Initialize
  recalculateAll();
});
