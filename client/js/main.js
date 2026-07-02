// =============================================
// TRAVEL HEAVEN — main.js
// Global: Loader, Navbar, Alerts, Auth, Theme, Chatbot
// =============================================

// ---- Page Loader hiding ----
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => { loader.style.display = 'none'; }, 500);
  }
});

// ---- Sticky Navbar scroll trigger ----
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (navbar) {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
});

// ---- Mobile menu drawer toggle ----
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('menu-toggle');
  const links = document.getElementById('nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const isOpen = links.style.display === 'flex';
      links.style.display = isOpen ? 'none' : 'flex';
      links.style.flexDirection = 'column';
      links.style.position = 'absolute';
      links.style.top = '100%';
      links.style.left = '0';
      links.style.width = '100%';
      links.style.background = 'var(--theme-surface)';
      links.style.padding = '20px';
      links.style.boxShadow = 'var(--shadow-md)';
      links.style.gap = '15px';
      links.style.zIndex = '999';
    });
  }

  setupAuthNavbar();
  initThemeToggle();
  initChatbot();
  initScrollReveal();
});

// ---- Dynamic Alert banners ----
function showAlert(message, type = 'success') {
  let container = document.querySelector('.alert-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'alert-container';
    document.body.appendChild(container);
  }
  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  const icon = type === 'success' ? '✓' : '⚠';
  alert.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  container.appendChild(alert);
  setTimeout(() => {
    alert.style.animation = 'slideIn 0.3s ease reverse forwards';
    setTimeout(() => alert.remove(), 300);
  }, 3000);
}

// ---- Session navbar update ----
function setupAuthNavbar() {
  const navAuth = document.getElementById('nav-auth');
  const navLinks = document.getElementById('nav-links');
  if (!navAuth) return;
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  let html = '';
  if (token && userStr) {
    const user = JSON.parse(userStr);
    html = `
      <a href="dashboard.html" class="btn btn-outline" style="padding: 8px 18px; font-size: 13px;">Dashboard</a>
      <button onclick="handleUserLogout()" class="btn btn-secondary" style="padding: 8px 18px; font-size: 13px;">Sign Out</button>
    `;
  } else {
    html = `
      <a href="login.html" class="btn btn-outline" style="padding: 8px 18px; font-size: 13px;">Login</a>
      <a href="register.html" class="btn btn-primary" style="padding: 8px 18px; font-size: 13px;">Sign Up</a>
    `;
  }

  // Set desktop auth HTML
  navAuth.innerHTML = html;

  // Set mobile auth inside the drawer to prevent empty states or overlaps
  if (navLinks) {
    // Remove existing mobile auth item if it exists (for logout updates)
    const existingMobileAuth = navLinks.querySelector('.mobile-auth-item');
    if (existingMobileAuth) existingMobileAuth.remove();

    const li = document.createElement('li');
    li.className = 'mobile-auth-item';
    li.style.marginTop = '15px';
    li.style.paddingTop = '15px';
    li.style.borderTop = '1px solid var(--theme-border)';
    li.style.display = 'flex';
    li.style.gap = '10px';
    li.style.width = '100%';
    li.innerHTML = html;

    navLinks.appendChild(li);
  }
}

// ---- User Logout ----
function handleUserLogout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  showAlert('Signed out successfully. Come back soon!', 'success');
  setTimeout(() => { window.location.href = 'index.html'; }, 1000);
}

// =============================================
// THEME TOGGLE (Dark / Light Mode)
// =============================================
function initThemeToggle() {
  // Apply saved theme immediately
  const savedTheme = localStorage.getItem('th-theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  // Inject theme toggle button into each page's navbar
  injectThemeToggleBtn(savedTheme);
}

function injectThemeToggleBtn(currentTheme) {
  const navAuth = document.getElementById('nav-auth');
  if (!navAuth) return;

  // Create theme button
  const btn = document.createElement('button');
  btn.id = 'theme-toggle-btn';
  btn.className = 'theme-toggle-btn';
  btn.title = 'Toggle dark/light mode';
  btn.setAttribute('aria-label', 'Toggle dark/light mode');
  btn.innerHTML = currentTheme === 'dark' ? '☀️' : '🌙';

  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('th-theme', next);
    btn.innerHTML = next === 'dark' ? '☀️' : '🌙';
  });

  // Insert before nav-auth
  navAuth.parentNode.insertBefore(btn, navAuth);
}

// =============================================
// TRAVEL CHATBOT
// =============================================

const CHATBOT_KB = {
  greetings: ['hi', 'hello', 'hey', 'good morning', 'good evening', 'good afternoon', 'howdy'],
  farewells: ['bye', 'goodbye', 'see you', 'thanks', 'thank you', 'cya', 'later'],
  topics: {
    destinations: {
      keywords: ['destination', 'place', 'where', 'country', 'location', 'visit', 'travel to', 'recommend'],
      responses: [
        "🌍 We offer amazing destinations including **Bali, Paris, Manali, Goa, Kerala & Tokyo**! Each has unique packages tailored to your budget. Want to explore a specific one?",
        "✈️ Some top picks: **Bali** for romance, **Manali** for adventure, **Goa** for beaches, and **Paris** for luxury! Visit our <a href='destinations.html' style='color:var(--secondary)'>Destinations page</a> to see all options.",
        "🗺️ We have both **Domestic** (Goa, Kerala, Manali) and **International** (Bali, Paris, Tokyo) destinations. What type interests you?"
      ]
    },
    packages: {
      keywords: ['package', 'tour', 'deal', 'offer', 'bundle', 'itinerary', 'plan'],
      responses: [
        "📦 Our tour packages range from **₹15,920** (Goa 3-day) to **₹1,19,920** (Luxury Paris). Each includes accommodation, meals, and guided activities. Check our <a href='packages.html' style='color:var(--secondary)'>Packages page</a>!",
        "🎫 Popular packages: **7-Day Bali Romantic Getaway**, **Luxury Paris Honeymoon**, **Thrill-Seekers Manali Adventure**, and **Kerala Backwaters Experience**. Which one interests you?",
        "💼 We have packages for every budget — Budget 🎒, Mid-Range 🌟, and Luxury 💎. All packages include detailed day-by-day itineraries!"
      ]
    },
    booking: {
      keywords: ['book', 'booking', 'reserve', 'reservation', 'checkout', 'buy', 'purchase', 'pay'],
      responses: [
        "🛒 To book a package: Browse destinations → Click **Explore Packages** → Select your package → Proceed to **Secure Checkout**. Create a free account first!",
        "✅ Booking is simple! **Login or Register** → Browse packages → Click **Book Now** → Complete payment. You'll get a confirmation email instantly.",
        "📋 After booking, you can track your reservation in your <a href='dashboard.html' style='color:var(--secondary)'>Dashboard</a>. Need help with a specific booking?"
      ]
    },
    price: {
      keywords: ['price', 'cost', 'cheap', 'affordable', 'expensive', 'budget', 'how much', 'fee', 'charge'],
      responses: [
        "💰 Our prices start from just **₹15,920 for 3-day Goa** up to **₹1,19,920 for 5-day Luxury Paris**. We have options for every budget!",
        "🏷️ Budget options start at ₹15,920, Mid-Range from ₹23,920-₹63,920, and Luxury from ₹1,19,920+. All prices include accommodation and most meals.",
        "💳 We accept secure online payments. All packages are competitively priced with no hidden fees. Want me to suggest the best value packages?"
      ]
    },
    contact: {
      keywords: ['contact', 'support', 'help', 'problem', 'issue', 'call', 'email', 'phone', 'reach', 'team'],
      responses: [
        "📞 Reach our support team via our <a href='contact.html' style='color:var(--secondary)'>Contact Us page</a>. We're available 24/7 to assist you!",
        "💬 For urgent help, use our Contact form at <a href='contact.html' style='color:var(--secondary)'>contact.html</a> or email us directly. Response time is under 2 hours!",
        "🎧 Our support team operates 24/7. You can also check your booking status anytime from your <a href='dashboard.html' style='color:var(--secondary)'>Dashboard</a>."
      ]
    },
    bali: {
      keywords: ['bali', 'indonesia', 'ubud', 'seminyak'],
      responses: [
        "🌴 **Bali** is our most popular destination! The **7-Day Romantic Getaway** (₹63,920) includes ocean villas, temple tours, Mount Batur hiking, and a sunset catamaran cruise. 🌅",
        "🏝️ Bali (Indonesia) is perfect for couples and nature lovers. Highlights: Uluwatu Temple, Tegallalang Rice Terraces, Nusa Penida island, and world-class spas!"
      ]
    },
    paris: {
      keywords: ['paris', 'france', 'eiffel', 'louvre', 'seine'],
      responses: [
        "🗼 **Paris Luxury Honeymoon** (₹1,19,920, 5 days) — includes Eiffel Tower skip-the-line, Seine River dinner cruise, Louvre private tour, and Versailles day trip. Pure luxury! 💎",
        "🥐 Paris is perfect for a romantic luxury getaway! Our package covers 4-star city-center accommodation, daily breakfasts, and all iconic sightseeing!"
      ]
    },
    manali: {
      keywords: ['manali', 'himachal', 'himalaya', 'mountain', 'trek', 'adventure', 'snow'],
      responses: [
        "🏔️ **Manali Adventure Package** (₹23,920, 4 days) — includes paragliding in Solang Valley, white water rafting, Jogini waterfall hike, and riverside camping! 🌊",
        "⛰️ Manali is perfect for thrill-seekers! Expect stunning Himalayan views, ATV rides, zorbing, and bonfire camping under the stars!"
      ]
    },
    goa: {
      keywords: ['goa', 'beach', 'calangute', 'baga', 'scuba'],
      responses: [
        "🌊 **Goa Beach Party Package** (₹15,920, 3 days) — our most affordable! Includes beachside resort, scuba diving, jet ski, dolphin sightseeing, and heritage church tour! 🐬",
        "☀️ Goa is ideal for budget beach lovers! Crystal clear waters, water sports, Portuguese-era heritage, and vibrant nightlife — all in 3 exciting days!"
      ]
    },
    kerala: {
      keywords: ['kerala', 'backwater', 'houseboat', 'munnar', 'ayurvedic', 'kochi'],
      responses: [
        "🌿 **Kerala Backwaters Experience** (₹39,920, 6 days) — cruise on a private houseboat in Alleppey, explore Munnar tea gardens, Thekkady wildlife, and Ayurvedic spa! 🍃",
        "🚤 Kerala is God's Own Country! Lush greenery, serene backwaters, spice plantations, and Ayurvedic therapies. Perfect for relaxation and nature lovers!"
      ]
    },
    login: {
      keywords: ['login', 'sign in', 'account', 'register', 'signup', 'sign up', 'password'],
      responses: [
        "🔐 You can <a href='login.html' style='color:var(--secondary)'>Login</a> or <a href='register.html' style='color:var(--secondary)'>Register</a> to access your bookings, dashboard, and exclusive member offers!",
        "👤 Creating an account is free and takes under 1 minute! <a href='register.html' style='color:var(--secondary)'>Sign up here</a> to start booking your dream vacation."
      ]
    },
    weather: {
      keywords: ['weather', 'climate', 'season', 'temperature', 'when to visit', 'best time'],
      responses: [
        "🌤️ Best times: **Bali** (Apr-Oct), **Paris** (Jun-Sep), **Manali** (May-Jun, Sep-Oct), **Goa** (Nov-Mar), **Kerala** (Sep-Mar). Want tips for a specific destination?",
        "🗓️ Each destination has its ideal travel season. Generally, avoid monsoon season for beach destinations and go in summer for mountain adventures!"
      ]
    },
    visa: {
      keywords: ['visa', 'passport', 'document', 'requirement', 'immigration'],
      responses: [
        "🛂 For **Bali** — visa on arrival (most countries). **Paris** — Schengen visa required. **Japan** — advance visa required. Contact us for help with documentation!",
        "📄 Our team can guide you through visa requirements for each destination. Visit the <a href='contact.html' style='color:var(--secondary)'>Contact page</a> for personalized assistance."
      ]
    }
  }
};

function getChatbotReply(userMsg) {
  const msg = userMsg.toLowerCase().trim();

  // Check greetings
  if (CHATBOT_KB.greetings.some(g => msg.includes(g))) {
    return "👋 Hello! I'm **TravelBot**, your personal travel assistant! I can help you with destinations, packages, bookings, prices, and more. What would you like to explore today? 🌍";
  }

  // Check farewells
  if (CHATBOT_KB.farewells.some(f => msg.includes(f))) {
    return "👋 Thanks for chatting! Have an amazing journey ahead! Don't hesitate to return if you need travel advice. ✈️🌟";
  }

  // Match topics
  for (const [topicKey, topic] of Object.entries(CHATBOT_KB.topics)) {
    if (topic.keywords.some(kw => msg.includes(kw))) {
      const replies = topic.responses;
      return replies[Math.floor(Math.random() * replies.length)];
    }
  }

  // Default fallback
  const fallbacks = [
    "🤔 That's an interesting question! I specialize in travel advice. Try asking about **destinations**, **packages**, **prices**, **booking**, or specific places like **Bali, Paris, Goa, Manali or Kerala**!",
    "💡 I'm not sure about that, but I can help you explore our **destinations**, **tour packages**, **pricing**, or **booking process**. What would you like to know?",
    "🌍 I'm best at answering travel-related questions! Ask me about our **destinations**, **packages**, **visa info**, **best travel seasons**, or how to **book a tour**."
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

function initChatbot() {
  // Create chatbot toggle button
  const toggleBtn = document.createElement('button');
  toggleBtn.id = 'chatbot-toggle';
  toggleBtn.title = 'Chat with TravelBot';
  toggleBtn.setAttribute('aria-label', 'Open TravelBot chat assistant');
  toggleBtn.innerHTML = '💬';
  document.body.appendChild(toggleBtn);

  // Create chatbot window
  const chatWindow = document.createElement('div');
  chatWindow.id = 'chatbot-window';
  chatWindow.setAttribute('role', 'dialog');
  chatWindow.setAttribute('aria-label', 'TravelBot Chat Assistant');
  chatWindow.innerHTML = `
    <div class="chatbot-header">
      <div class="chatbot-avatar">✈️</div>
      <div class="chatbot-info">
        <h4>TravelBot</h4>
        <span><span class="chatbot-status-dot"></span> Online — always ready</span>
      </div>
      <button class="chatbot-close" id="chatbot-close" aria-label="Close chatbot">✕</button>
    </div>
    <div class="chatbot-messages" id="chatbot-messages"></div>
    <div class="chatbot-quick-replies" id="chatbot-quick-replies">
      <button class="quick-reply-btn" onclick="sendQuickReply('Popular destinations')">🌍 Destinations</button>
      <button class="quick-reply-btn" onclick="sendQuickReply('Show me packages')">📦 Packages</button>
      <button class="quick-reply-btn" onclick="sendQuickReply('What are the prices?')">💰 Pricing</button>
      <button class="quick-reply-btn" onclick="sendQuickReply('How do I book?')">🛒 How to book</button>
    </div>
    <div class="chatbot-input-area">
      <input type="text" id="chatbot-input" placeholder="Ask me about destinations, packages..." maxlength="200" autocomplete="off">
      <button id="chatbot-send" aria-label="Send message">➤</button>
    </div>
  `;
  document.body.appendChild(chatWindow);

  // Show welcome message
  setTimeout(() => addBotMessage("👋 Hi! I'm **TravelBot** — your personal travel assistant! Ask me about destinations, packages, prices, visa info, or anything travel-related! 🌍✈️"), 500);

  // Trigger introductory wiggle animation to invite user click after 2.5 seconds
  setTimeout(() => {
    toggleBtn.classList.add('chatbot-wobble');
    setTimeout(() => toggleBtn.classList.remove('chatbot-wobble'), 3000);
  }, 2500);

  // Toggle open/close
  toggleBtn.addEventListener('click', () => {
    const isOpen = chatWindow.classList.contains('open');
    chatWindow.classList.toggle('open');
    toggleBtn.innerHTML = isOpen ? '💬' : '✕';
  });

  document.getElementById('chatbot-close').addEventListener('click', () => {
    chatWindow.classList.remove('open');
    toggleBtn.innerHTML = '💬';
  });

  // Send on button click
  document.getElementById('chatbot-send').addEventListener('click', sendChatMessage);

  // Send on Enter key
  document.getElementById('chatbot-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendChatMessage();
  });
}

function addBotMessage(text) {
  const msgs = document.getElementById('chatbot-messages');
  if (!msgs) return;
  const div = document.createElement('div');
  div.className = 'chat-msg bot';
  div.innerHTML = `
    <div class="chat-msg-avatar">🤖</div>
    <div class="chat-bubble">${text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</div>
  `;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function addUserMessage(text) {
  const msgs = document.getElementById('chatbot-messages');
  if (!msgs) return;
  const div = document.createElement('div');
  div.className = 'chat-msg user';
  div.innerHTML = `
    <div class="chat-msg-avatar">👤</div>
    <div class="chat-bubble">${escapeHtml(text)}</div>
  `;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function showTypingIndicator() {
  const msgs = document.getElementById('chatbot-messages');
  if (!msgs) return null;
  const div = document.createElement('div');
  div.className = 'chat-msg bot';
  div.id = 'chat-typing-indicator';
  div.innerHTML = `
    <div class="chat-msg-avatar">🤖</div>
    <div class="chat-typing"><span></span><span></span><span></span></div>
  `;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  return div;
}

function sendChatMessage() {
  const input = document.getElementById('chatbot-input');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  input.value = '';

  addUserMessage(text);

  // Hide quick replies after first message
  const qr = document.getElementById('chatbot-quick-replies');
  if (qr) qr.style.display = 'none';

  // Show typing indicator with a delay for realism
  const typingEl = showTypingIndicator();
  const delay = 600 + Math.random() * 800;

  setTimeout(() => {
    if (typingEl) typingEl.remove();
    const reply = getChatbotReply(text);
    addBotMessage(reply);
  }, delay);
}

function sendQuickReply(text) {
  const input = document.getElementById('chatbot-input');
  if (input) input.value = text;
  sendChatMessage();
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ---- Debounce Helper ----
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ---- Count-Up Number Animation Helper ----
function animateValue(obj, start, end, duration, formatFn = (val) => val) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const val = Math.floor(progress * (end - start) + start);
    obj.innerHTML = formatFn(val);
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

// =============================================
// INTERSECTION OBSERVER FOR SCROLL REVEALS
// =============================================
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger-grid');
  
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Once animated, we don't need to observe it anymore
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.01,
      rootMargin: '0px 0px 80px 0px'
    });
    
    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if browser doesn't support IntersectionObserver
    revealElements.forEach(el => el.classList.add('active'));
  }
}

// =============================================
// INTERACTIVE LOADER PHRASE CYCLER
// =============================================
(function() {
  const setupLoader = () => {
    const loaderWrapper = document.getElementById('loader');
    if (loaderWrapper) {
      const innerLoader = loaderWrapper.querySelector('.loader');
      if (innerLoader && !loaderWrapper.querySelector('.loader-text')) {
        const container = document.createElement('div');
        container.style.textAlign = 'center';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.alignItems = 'center';

        // Swap loader into the container wrapper
        loaderWrapper.removeChild(innerLoader);
        container.appendChild(innerLoader);

        const loaderText = document.createElement('div');
        loaderText.className = 'loader-text';
        loaderText.innerHTML = '✨ Discovering Paradise...';
        container.appendChild(loaderText);

        loaderWrapper.appendChild(container);

        const phrases = [
          "✨ Discovering Paradise...",
          "✈️ Packing your virtual bags...",
          "🌍 Mapping out adventures...",
          "🏨 Finding cozy rooms...",
          "⭐ Finding the best packages..."
        ];
        let phraseIdx = 0;
        const interval = setInterval(() => {
          const currentLoader = document.getElementById('loader');
          if (!currentLoader || currentLoader.style.display === 'none' || currentLoader.style.opacity === '0') {
            clearInterval(interval);
          } else {
            phraseIdx = (phraseIdx + 1) % phrases.length;
            loaderText.innerHTML = phrases[phraseIdx];
          }
        }, 800);
      }
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupLoader);
  } else {
    setupLoader();
  }
})();




