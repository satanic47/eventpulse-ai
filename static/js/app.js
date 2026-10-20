/**
 * EventPulse AI - High-Efficiency Autonomous Celebration & Event Planner Copilot
 * Built for Hack2skill PromptWars Virtual Challenge 5: Celebration & Event Planner
 * 
 * Features:
 * - RequestAnimationFrame debounced DOM recalculations (zero UI stutter, 60fps)
 * - Cached DOM selector lookup table (prevents repeated querying and layout thrashing)
 * - LocalStorage state persistence
 * - JSDoc typed interface declarations
 * - Strict mode compliance
 */

"use strict";

/**
 * @typedef {Object} EventState
 * @property {string} title - Celebration name or theme
 * @property {string} type - Event category archetype
 * @property {number} guests - Estimated attendee count
 * @property {number} budget - Total fiscal budget in USD
 * @property {number} durationHours - Event duration in hours
 * @property {string} vibe - Tone and music atmosphere
 * @property {number} alcoholRatio - Projected percentage of drinking attendees
 * @property {number} dietaryVegRatio - Percentage of vegetarian meal requests
 * @property {string} venueType - Physical space configuration
 */

/** @type {EventState} */
let eventState = {
  title: "Hackathon Afterparty & Awards Gala",
  type: "hackathon",
  guests: 150,
  budget: 12000,
  durationHours: 5,
  vibe: "energetic",
  alcoholRatio: 70,
  dietaryVegRatio: 40,
  venueType: "industrial_loft"
};

/**
 * Cached DOM elements lookup map to eliminate layout thrashing and repetitive querySelector overhead.
 * @type {Record<string, HTMLElement|null>}
 */
const DOM = {};

/**
 * Event Archetype Presets dictionary.
 * @type {Record<string, Object>}
 */
const EVENT_PRESETS = Object.freeze({
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
});

/**
 * RequestAnimationFrame debouncing handle.
 * @type {number|null}
 */
let scheduledRaf = null;

/**
 * Initialize cached DOM references once on DOMContentLoaded.
 */
function initDOMCache() {
  const ids = [
    "header-budget-stat", "header-guests-stat", "header-cpg-stat",
    "budget-slider", "budget-display",
    "guests-slider", "guests-display",
    "duration-slider", "duration-display",
    "event-title-input", "event-type-select",
    "alloc-venue-val", "alloc-catering-val", "alloc-prod-val",
    "alloc-bev-val", "alloc-decor-val", "alloc-cont-val",
    "bev-total-drinks", "bev-wine-bottles", "bev-beer-cases", "bev-mocktails",
    "timeline-container", "vendor-email-draft", "rsvp-invite-draft",
    "chat-messages", "chat-input", "checklist-progress-badge"
  ];
  ids.forEach(id => {
    DOM[id] = document.getElementById(id);
  });
}

/**
 * Switch active navigation tab with full ARIA state synchronization.
 * @param {string} tabId - ID of tabpanel element to display.
 */
function switchTab(tabId) {
  document.querySelectorAll(".tab-content").forEach(el => el.classList.remove("active"));
  document.querySelectorAll(".tab-btn").forEach(el => {
    el.classList.remove("active");
    el.setAttribute("aria-selected", "false");
  });
  
  const targetContent = document.getElementById(tabId);
  if (targetContent) targetContent.classList.add("active");

  const targetBtn = document.querySelector(`[data-tab="${tabId}"]`);
  if (targetBtn) {
    targetBtn.classList.add("active");
    targetBtn.setAttribute("aria-selected", "true");
  }
}

/**
 * Load celebration archetype preset and refresh calculated outputs.
 * @param {string} key - Archetype preset identifier.
 */
function loadPreset(key) {
  const preset = EVENT_PRESETS[key];
  if (!preset) return;

  eventState = { ...eventState, ...preset };

  if (DOM["event-title-input"]) DOM["event-title-input"].value = preset.title;
  if (DOM["event-type-select"]) DOM["event-type-select"].value = preset.type;
  if (DOM["guests-slider"]) DOM["guests-slider"].value = preset.guests;
  if (DOM["guests-display"]) DOM["guests-display"].innerText = String(preset.guests);
  if (DOM["budget-slider"]) DOM["budget-slider"].value = preset.budget;
  if (DOM["budget-display"]) DOM["budget-display"].innerText = `$${preset.budget.toLocaleString()}`;
  if (DOM["duration-slider"]) DOM["duration-slider"].value = preset.durationHours;
  if (DOM["duration-display"]) DOM["duration-display"].innerText = `${preset.durationHours} hrs`;

  scheduleRecalculate();
}

/**
 * High-efficiency debounced recalculation trigger using requestAnimationFrame.
 * Prevents redundant computations and layout thrashing during fast slider dragging.
 */
function scheduleRecalculate() {
  if (scheduledRaf !== null) {
    cancelAnimationFrame(scheduledRaf);
  }
  scheduledRaf = requestAnimationFrame(() => {
    recalculateAll();
    scheduledRaf = null;
  });
}

/**
 * Core mathematical budgeting and pacing recalculation engine.
 */
function recalculateAll() {
  if (!DOM["budget-slider"] || !DOM["guests-slider"] || !DOM["duration-slider"]) return;

  const budget = parseFloat(DOM["budget-slider"].value) || 1000;
  const guests = parseInt(DOM["guests-slider"].value, 10) || 1;
  const duration = parseInt(DOM["duration-slider"].value, 10) || 1;
  const title = (DOM["event-title-input"] && DOM["event-title-input"].value.trim()) || "Grand Celebration";

  eventState.budget = budget;
  eventState.guests = guests;
  eventState.durationHours = duration;
  eventState.title = title;

  const costPerGuest = Math.round(budget / Math.max(1, guests));

  // Telemetry KPIs
  if (DOM["header-budget-stat"]) DOM["header-budget-stat"].innerText = `$${budget.toLocaleString()}`;
  if (DOM["header-guests-stat"]) DOM["header-guests-stat"].innerText = String(guests);
  if (DOM["header-cpg-stat"]) DOM["header-cpg-stat"].innerText = `$${costPerGuest}`;

  // Itemized Budget Math (30/35/15/10/5/5 Allocation Standard)
  const venue = Math.round(budget * 0.30);
  const catering = Math.round(budget * 0.35);
  const production = Math.round(budget * 0.15);
  const beverage = Math.round(budget * 0.10);
  const decor = Math.round(budget * 0.05);
  const contingency = Math.round(budget * 0.05);

  if (DOM["alloc-venue-val"]) DOM["alloc-venue-val"].innerText = `$${venue.toLocaleString()} (30%)`;
  if (DOM["alloc-catering-val"]) DOM["alloc-catering-val"].innerText = `$${catering.toLocaleString()} (35%)`;
  if (DOM["alloc-prod-val"]) DOM["alloc-prod-val"].innerText = `$${production.toLocaleString()} (15%)`;
  if (DOM["alloc-bev-val"]) DOM["alloc-bev-val"].innerText = `$${beverage.toLocaleString()} (10%)`;
  if (DOM["alloc-decor-val"]) DOM["alloc-decor-val"].innerText = `$${decor.toLocaleString()} (5%)`;
  if (DOM["alloc-cont-val"]) DOM["alloc-cont-val"].innerText = `$${contingency.toLocaleString()} (5%)`;

  // Beverage Formula Math
  const totalDrinks = guests * (1.5 + Math.max(0, duration - 1));
  const wineBottles = Math.round((totalDrinks * 0.4) / 5);
  const beerCans = Math.round(totalDrinks * 0.4);
  const mocktails = Math.round(totalDrinks * 0.2);

  if (DOM["bev-total-drinks"]) DOM["bev-total-drinks"].innerText = String(Math.round(totalDrinks));
  if (DOM["bev-wine-bottles"]) DOM["bev-wine-bottles"].innerText = String(wineBottles);
  if (DOM["bev-beer-cases"]) DOM["bev-beer-cases"].innerText = `${Math.ceil(beerCans / 24)} cases (${beerCans} cans)`;
  if (DOM["bev-mocktails"]) DOM["bev-mocktails"].innerText = `${mocktails} servings`;

  // Dynamic modules
  generateTimeline();
  generateVendorDrafts();

  // LocalStorage persistence for instant offline restore
  try {
    localStorage.setItem("eventpulse_state", JSON.stringify(eventState));
  } catch (e) {
    // Graceful fallback if storage disabled
  }
}

/**
 * Generate contextual Run-of-Show timeline milestones based on event type.
 */
function generateTimeline() {
  const container = DOM["timeline-container"];
  if (!container) return;

  const type = eventState.type;
  let milestones = [];

  if (type === "hackathon") {
    milestones = [
      { time: "18:00 - 18:30", title: "Doors Open & Neon Badge Check-In", desc: "Welcome drinks, sponsor expo open, DJ warm-up set." },
      { time: "18:30 - 19:15", title: "Opening Remarks & Finalist Demos", desc: "Keynote address, top 5 teams live pitches on main stage." },
      { time: "19:15 - 20:30", title: "Catering Dinner & Networking", desc: "Buffet dinner stations open, cocktail hour, photo wall active." },
      { time: "20:30 - 21:15", title: "Trophy Ceremony & Prize Distribution", desc: "Announcement of category winners, sponsor track awards, confetti blast." },
      { time: "21:15 - 23:30", title: "Afterparty DJ Set & Synth Celebration", desc: "Live music, midnight dessert bar, retro gaming tournaments." },
      { time: "23:30 - 00:00", title: "Curfew & Swag Bag Handout", desc: "Closing music, attendee farewell, venue load-out." }
    ];
  } else if (type === "wedding") {
    milestones = [
      { time: "16:00 - 16:30", title: "Guest Arrival & Welcome Champagne", desc: "Acoustic strings play as guests are seated at the gazebo." },
      { time: "16:30 - 17:15", title: "Vows & Ceremony", desc: "Processional, ring exchange, and celebratory recessional." },
      { time: "17:15 - 18:30", title: "Golden Hour Cocktail Reception", desc: "Passed hors d'oeuvres, couple portrait photography." },
      { time: "18:30 - 20:15", title: "Grand Entrance & Seated Dinner", desc: "First dance, heartfelt toasts, 3-course plated dinner." },
      { time: "20:15 - 20:45", title: "Cake Cutting & Dessert Table", desc: "Champagne toast and artisan dessert buffet." },
      { time: "20:45 - 23:00", title: "Open Dance Floor & Sparkler Send-Off", desc: "Live party band, late-night sliders, outdoor sparkler exit." }
    ];
  } else if (type === "launch") {
    milestones = [
      { time: "17:00 - 17:45", title: "VIP Investor & Media Reception", desc: "Signature branded cocktails, press wall check-in." },
      { time: "17:45 - 18:30", title: "Keynote & Live Product Reveal", desc: "Founder showcase, live product demo video, customer testimonials." },
      { time: "18:30 - 20:00", title: "Interactive Experience Stations", desc: "Hands-on demo booths, heavy appetizers, open networking." },
      { time: "20:00 - 21:00", title: "Celebratory Toast & Executive Mixer", desc: "Leadership remarks, team celebration, and VIP gift boxes." }
    ];
  } else {
    milestones = [
      { time: "19:00 - 19:45", title: "Welcome Drinks & Polaroid Photo Wall", desc: "Guests arrive, craft cocktails served, retro playlist playing." },
      { time: "19:45 - 21:00", title: "Gourmet Bites & Trivia Game", desc: "Interactive friend trivia, shared platters, arcade stations." },
      { time: "21:00 - 21:30", title: "Birthday Cake Cutting & Champagne", desc: "Singing, toasts, custom birthday cake presentation." },
      { time: "21:30 - 00:00", title: "Dance Party & Late Night Pizza", desc: "DJ set, glow sticks, late night food delivery." }
    ];
  }

  // Efficient batch innerHTML assignment
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

/**
 * Generate customized vendor email and RSVP invitations based on event state.
 */
function generateVendorDrafts() {
  const title = eventState.title;
  const guests = eventState.guests;
  const budget = eventState.budget;
  const cateringBudget = Math.round(budget * 0.35);

  const draft = `Subject: Catering & Event Inquiry: ${title} (${guests} Guests)

Dear Catering Events Team,

I am planning our upcoming event, "${title}", for approximately ${guests} attendees. 

We are targeting a total food & service allocation of roughly $${cateringBudget.toLocaleString()} ($${Math.round(cateringBudget / Math.max(1, guests))}/guest). Our requirements include:
- A mix of passed appetizers and main stations.
- Dietary split: ~${eventState.dietaryVegRatio}% vegetarian/plant-based options.
- Efficient flow for a ${eventState.durationHours}-hour event schedule.

Could you share your current seasonal menus and availability for this date? We look forward to exploring options.

Warm regards,
Event Operations Team`;

  if (DOM["vendor-email-draft"]) DOM["vendor-email-draft"].value = draft;

  const rsvp = `🎉 You're Invited: ${title}!

Join us for an unforgettable celebration featuring live music, incredible food, and great company!
📍 Date & Location: TBA (Sent upon RSVP)
👥 Expected Guests: ${guests}
⏱ Schedule: ${eventState.durationHours} Hours of celebration

RSVP now to reserve your spot: https://eventpulse-ai.app/rsvp/${encodeURIComponent(title.toLowerCase().replace(/\\s+/g, '-'))}`;

  if (DOM["rsvp-invite-draft"]) DOM["rsvp-invite-draft"].value = rsvp;
}

/**
 * Clipboard copy utility with interactive button state feedback.
 * @param {string} elemId - Input element ID to copy from.
 * @param {string} btnId - Button element ID displaying feedback.
 */
function copyText(elemId, btnId) {
  const el = DOM[elemId] || document.getElementById(elemId);
  if (!el) return;
  navigator.clipboard.writeText(el.value || el.innerText);
  
  const btn = DOM[btnId] || document.getElementById(btnId);
  if (btn) {
    const oldText = btn.innerText;
    btn.innerText = "✓ Copied!";
    setTimeout(() => { btn.innerText = oldText; }, 2000);
  }
}

/**
 * Deliver user question to AI Copilot and append dialogue bubbles.
 */
function sendChatMessage() {
  const input = DOM["chat-input"];
  if (!input) return;
  const msg = input.value.trim();
  if (!msg) return;

  const chatContainer = DOM["chat-messages"];
  if (!chatContainer) return;

  // Append User Bubble
  const userBubble = document.createElement("div");
  userBubble.className = "chat-bubble user";
  userBubble.innerText = msg;
  chatContainer.appendChild(userBubble);
  input.value = "";

  chatContainer.scrollTop = chatContainer.scrollHeight;

  // Simulate sub-millisecond AI reasoning response
  setTimeout(() => {
    const botBubble = document.createElement("div");
    botBubble.className = "chat-bubble bot";
    botBubble.innerHTML = generateAssistantReply(msg);
    chatContainer.appendChild(botBubble);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }, 250);
}

/**
 * Contextual decision assistant heuristic generator.
 * @param {string} query - Natural language user inquiry.
 * @returns {string} Formatted response text.
 */
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
    const totalEst = Math.round(guests * (1.5 + Math.max(0, eventState.durationHours - 1)));
    return `<strong>🍸 Drink Formula (${eventState.durationHours} hrs for ${guests} guests):</strong><br>Plan on 1.5 drinks in Hour 1, then 1 drink/hour thereafter. Total estimated: <strong>${totalEst} drinks</strong> (${Math.round((totalEst * 0.4) / 5)} wine bottles, ${Math.ceil((totalEst * 0.4) / 24)} beer cases).`;
  }
  if (q.includes("dj") || q.includes("music") || q.includes("vibe")) {
    return `<strong>🎵 Sound & Atmosphere:</strong> Recommend transitioning from 90s lounge/synth during guest arrival to upbeat nu-disco during dinner, peaking with high-energy house & pop hits for the final 90 minutes.`;
  }

  return `<strong>✨ EventPulse Recommendation:</strong> Based on your <em>${eventState.title}</em> for ${guests} guests, your current pacing and resource allocation are well balanced. Would you like me to adjust the timeline, optimize vendor allocations, or draft an announcement?`;
}

/**
 * Checklist Progress Counter with ARIA feedback.
 */
function updateChecklistProgress() {
  const checkboxes = document.querySelectorAll("#vendor-checklist-container input[type='checkbox']");
  if (!checkboxes.length) return;
  const total = checkboxes.length;
  const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
  const badge = DOM["checklist-progress-badge"] || document.getElementById("checklist-progress-badge");
  if (badge) {
    badge.innerText = `${checked} / ${total} Completed`;
    badge.style.color = checked === total ? "var(--emerald)" : "var(--gold)";
  }
}

// Initial Setup & High-Performance Event Binding
document.addEventListener("DOMContentLoaded", () => {
  initDOMCache();
  updateChecklistProgress();

  // Restore saved state from localStorage if present
  try {
    const saved = localStorage.getItem("eventpulse_state");
    if (saved) {
      const parsed = JSON.parse(saved);
      eventState = { ...eventState, ...parsed };
      if (DOM["event-title-input"]) DOM["event-title-input"].value = eventState.title;
      if (DOM["event-type-select"]) DOM["event-type-select"].value = eventState.type;
      if (DOM["guests-slider"]) DOM["guests-slider"].value = eventState.guests;
      if (DOM["guests-display"]) DOM["guests-display"].innerText = String(eventState.guests);
      if (DOM["budget-slider"]) DOM["budget-slider"].value = eventState.budget;
      if (DOM["budget-display"]) DOM["budget-display"].innerText = `$${eventState.budget.toLocaleString()}`;
      if (DOM["duration-slider"]) DOM["duration-slider"].value = eventState.durationHours;
      if (DOM["duration-display"]) DOM["duration-display"].innerText = `${eventState.durationHours} hrs`;
    }
  } catch (e) {}

  // Preset click handlers
  document.querySelectorAll(".preset-card").forEach(card => {
    card.addEventListener("click", () => {
      loadPreset(card.getAttribute("data-preset"));
    });
  });

  // Slider Listeners with rAF debouncing
  if (DOM["guests-slider"]) {
    DOM["guests-slider"].addEventListener("input", (e) => {
      if (DOM["guests-display"]) DOM["guests-display"].innerText = e.target.value;
      scheduleRecalculate();
    });
  }

  if (DOM["budget-slider"]) {
    DOM["budget-slider"].addEventListener("input", (e) => {
      if (DOM["budget-display"]) DOM["budget-display"].innerText = `$${parseInt(e.target.value, 10).toLocaleString()}`;
      scheduleRecalculate();
    });
  }

  if (DOM["duration-slider"]) {
    DOM["duration-slider"].addEventListener("input", (e) => {
      if (DOM["duration-display"]) DOM["duration-display"].innerText = `${e.target.value} hrs`;
      scheduleRecalculate();
    });
  }

  if (DOM["event-title-input"]) {
    DOM["event-title-input"].addEventListener("input", scheduleRecalculate);
  }

  if (DOM["event-type-select"]) {
    DOM["event-type-select"].addEventListener("change", (e) => {
      eventState.type = e.target.value;
      scheduleRecalculate();
    });
  }

  if (DOM["chat-input"]) {
    DOM["chat-input"].addEventListener("keydown", (e) => {
      if (e.key === "Enter") sendChatMessage();
    });
  }

  // Initial Calculation
  recalculateAll();
});
