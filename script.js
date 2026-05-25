/* ============================================================
   NYXORIA — Interactive layer
   ============================================================ */

/* ---------- Starfield ---------- */
(function starfield() {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [];
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth * devicePixelRatio;
    h = canvas.height = window.innerHeight * devicePixelRatio;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    const count = Math.min(140, Math.floor((window.innerWidth * window.innerHeight) / 14000));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.4 * devicePixelRatio + 0.2,
      a: Math.random() * 0.8 + 0.1,
      tw: Math.random() * 0.02 + 0.005,
      gold: Math.random() > 0.85,
    }));
  }
  window.addEventListener('resize', resize);
  resize();

  function frame() {
    ctx.clearRect(0, 0, w, h);
    for (const s of stars) {
      s.a += s.tw * (Math.random() > 0.5 ? 1 : -1);
      if (s.a < 0.1) s.a = 0.1;
      if (s.a > 0.95) s.a = 0.95;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.gold
        ? `rgba(244, 215, 117, ${s.a})`
        : `rgba(232, 220, 255, ${s.a * 0.7})`;
      ctx.fill();
      if (s.gold) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(244, 215, 117, ${s.a * 0.08})`;
        ctx.fill();
      }
    }
    requestAnimationFrame(frame);
  }
  frame();
})();

/* ---------- Mobile nav ---------- */
const navBurger = document.getElementById('navBurger');
if (navBurger) {
  navBurger.addEventListener('click', () => {
    const links = document.querySelector('.nav-links');
    const cta = document.querySelector('.nav-cta');
    if (!links) return;
    const isOpen = links.dataset.open === 'true';
    links.dataset.open = (!isOpen).toString();
    links.style.display = isOpen ? '' : 'flex';
    links.style.flexDirection = 'column';
    links.style.position = 'absolute';
    links.style.top = '64px';
    links.style.right = '20px';
    links.style.padding = '20px';
    links.style.background = 'rgba(20, 14, 36, 0.95)';
    links.style.border = '1px solid var(--line-strong)';
    links.style.borderRadius = '16px';
    links.style.backdropFilter = 'blur(12px)';
    if (isOpen) links.style.display = 'none';
  });
}

/* ---------- Auth modal ---------- */
function openAuth(tab = 'login') {
  const m = document.getElementById('authModal');
  if (!m) return;
  m.classList.add('open');
  switchAuthTab(tab);
}
function closeAuth() {
  const m = document.getElementById('authModal');
  if (m) m.classList.remove('open');
}
function switchAuthTab(tab) {
  document.querySelectorAll('.modal-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  const title = document.getElementById('modalTitle');
  const sub = document.getElementById('modalSub');
  const submit = document.getElementById('modalSubmit');
  const nameField = document.getElementById('nameField');
  if (tab === 'signup') {
    if (title) title.textContent = 'Cross the threshold.';
    if (sub) sub.textContent = 'Create your account. The oracle is waiting.';
    if (submit) submit.textContent = 'Begin';
    if (nameField) nameField.style.display = 'flex';
  } else {
    if (title) title.textContent = 'Welcome back, seeker.';
    if (sub) sub.textContent = 'The oracle remembers you.';
    if (submit) submit.textContent = 'Enter';
    if (nameField) nameField.style.display = 'none';
  }
}
window.openAuth = openAuth;
window.closeAuth = closeAuth;
window.switchAuthTab = switchAuthTab;

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeAuth();
    closeCardRitual();
  }
});

/* ============================================================
   CHAT PAGE
   ============================================================ */

/* ---------- Sidebar toggle (mobile) ---------- */
const sideToggle = document.getElementById('sideToggle');
const sideClose = document.getElementById('sideClose');
const appSide = document.getElementById('appSide');
if (sideToggle && appSide) sideToggle.addEventListener('click', () => appSide.classList.add('open'));
if (sideClose && appSide) sideClose.addEventListener('click', () => appSide.classList.remove('open'));

/* ---------- Chat ---------- */
const chatFeed = document.getElementById('chatFeed');
const composerInput = document.getElementById('composerInput');
const composerSend = document.getElementById('composerSend');

if (composerInput) {
  composerInput.addEventListener('input', () => {
    composerInput.style.height = 'auto';
    composerInput.style.height = Math.min(composerInput.scrollHeight, 180) + 'px';
  });
  composerInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
}
if (composerSend) composerSend.addEventListener('click', sendMessage);

function quickPrompt(text) {
  if (!composerInput) return;
  composerInput.value = text;
  sendMessage();
}
window.quickPrompt = quickPrompt;

function appendBubble(role, html) {
  if (!chatFeed) return null;
  const intro = chatFeed.querySelector('.chat-intro');
  if (intro) intro.remove();
  const div = document.createElement('div');
  div.className = `bubble ${role}`;
  if (role === 'bot') {
    div.innerHTML = `<div class="bubble-avatar">◈</div><div class="bubble-body">${html}</div>`;
  } else {
    div.innerHTML = `<div class="bubble-body">${html}</div>`;
  }
  chatFeed.appendChild(div);
  chatFeed.scrollTop = chatFeed.scrollHeight;
  return div;
}

function appendTyping() {
  if (!chatFeed) return null;
  const div = document.createElement('div');
  div.className = 'bubble bot typing';
  div.innerHTML = `<div class="bubble-avatar">◈</div><div class="bubble-body"><span class="dot-pulse"></span><span class="dot-pulse"></span><span class="dot-pulse"></span></div>`;
  chatFeed.appendChild(div);
  chatFeed.scrollTop = chatFeed.scrollHeight;
  return div;
}

/* The oracle has a voice. These are scripted responses for the demo. */
const oracleResponses = [
  "I hear you. Sit with that for a moment — the question beneath the question is always quieter.",
  "There is a thread here you've followed before. Notice where it doesn't lead. That, too, is an answer.",
  "The dark doesn't hide anything from you. It only waits for you to stop looking away.",
  "Some doors are not meant to be opened — they are meant to be noticed. You've noticed.",
  "Tell me what you would do if no one would ever know. The truth lives there.",
  "I won't pretend to know. But I will sit with you, and we will name it together.",
  "You already know what you'd say to a friend in your place. Say it now, to yourself.",
  "There is a softness in your question that the words can't quite carry. I hear that, too.",
];

function oracleReply(userText) {
  const lower = userText.toLowerCase();
  if (lower.includes('card') || lower.includes('pull')) {
    return `A card, then. The deck has already chosen — but you must still draw it. <br/><button class="inline-card-btn" onclick="openCardRitual()"><span>✦</span> Pull a card</button>`;
  }
  if (lower.includes('hello') || lower.includes('hi ') || lower === 'hi' || lower.includes('hey')) {
    return "Hello, seeker. The room is quiet tonight. What weight have you brought with you?";
  }
  if (lower.includes('love') || lower.includes('relationship') || lower.includes('him') || lower.includes('her')) {
    return "Love. The oldest question, asked in a thousand new voices. What is it you want me to tell you that you don't already suspect?";
  }
  if (lower.includes('?')) {
    return oracleResponses[Math.floor(Math.random() * oracleResponses.length)];
  }
  return oracleResponses[Math.floor(Math.random() * oracleResponses.length)];
}

function sendMessage() {
  const text = (composerInput?.value || '').trim();
  if (!text) return;
  appendBubble('user', escapeHtml(text));
  composerInput.value = '';
  composerInput.style.height = 'auto';
  const typing = appendTyping();
  const delay = 700 + Math.random() * 900;
  setTimeout(() => {
    typing?.remove();
    appendBubble('bot', `<p>${oracleReply(text)}</p>`);
  }, delay);
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

function newReading() {
  if (!chatFeed) return;
  chatFeed.innerHTML = '';
  const intro = document.createElement('div');
  intro.className = 'chat-intro';
  intro.innerHTML = `
    <div class="intro-mark">◈</div>
    <h1 class="intro-title">A new room. A new question.</h1>
    <p class="intro-sub">The deck has been reshuffled. Begin again, whenever you're ready.</p>
    <div class="intro-actions">
      <button class="chip" onclick="quickPrompt('What does the universe want me to know today?')">What does the universe want me to know today?</button>
      <button class="chip" onclick="quickPrompt('Why do I keep dreaming of the same door?')">Why do I keep dreaming of the same door?</button>
      <button class="chip chip-gold" onclick="openCardRitual()"><span>✦</span> Pull a card</button>
    </div>`;
  chatFeed.appendChild(intro);
}
window.newReading = newReading;

/* ============================================================
   CARD RITUAL
   ============================================================ */

const cards = [
  { symbol: '☾', name: 'The Moon', sub: 'Illusion · Dreams · The hidden',
    meaning: "Something you've been telling yourself in the dark is no longer true. Look again, in softer light." },
  { symbol: '✦', name: 'The Star', sub: 'Hope · Renewal · Quiet faith',
    meaning: "After a long unraveling, a small bright thing returns. Don't rush it. Let it find its shape." },
  { symbol: '☥', name: 'The Hermit', sub: 'Solitude · Inner light',
    meaning: "Withdraw — not from the world, but from the noise. The lamp you've been looking for, you've been carrying." },
  { symbol: '⚝', name: 'The Tower', sub: 'Sudden change · Liberation',
    meaning: "Something is collapsing. Let it. What it held was never yours to keep." },
  { symbol: '☉', name: 'The Sun', sub: 'Clarity · Joy · Becoming',
    meaning: "A simple truth is about to feel obvious. Speak it gently to yourself, the way you'd speak to a child." },
  { symbol: '☽', name: 'The High Priestess', sub: 'Intuition · Threshold',
    meaning: "You already know. The question is whether you'll trust the knowing, or ask one more time." },
  { symbol: '♆', name: 'The Empress', sub: 'Creation · Tender power',
    meaning: "Something inside you is asking to be made. Don't refuse it for being small or strange." },
  { symbol: '⚹', name: 'The Lovers', sub: 'Choice · Union',
    meaning: "Two paths look the same in this light. They are not. Listen for which one your body answers first." },
  { symbol: '☿', name: 'The Magician', sub: 'Will · Manifestation',
    meaning: "You have every tool already. The hesitation is the work now." },
  { symbol: '♄', name: 'The World', sub: 'Completion · Wholeness',
    meaning: "A long circle is closing. Honor it. The next door opens on the other side of the bow." },
];

const deckEl = document.getElementById('deck');
const ritualModal = document.getElementById('ritualModal');
const ritualResult = document.getElementById('ritualResult');
let chosenCard = null;

function buildDeck() {
  if (!deckEl) return;
  deckEl.innerHTML = '';
  for (let i = 0; i < 7; i++) {
    const card = document.createElement('div');
    card.className = 'deck-card';
    card.addEventListener('click', () => drawCard(card));
    deckEl.appendChild(card);
  }
}

function openCardRitual() {
  if (!ritualModal) return;
  ritualResult?.classList.remove('open');
  ritualResult?.setAttribute('aria-hidden', 'true');
  if (deckEl) deckEl.style.display = '';
  buildDeck();
  ritualModal.classList.add('open');
  ritualModal.setAttribute('aria-hidden', 'false');
}
function closeCardRitual() {
  if (!ritualModal) return;
  ritualModal.classList.remove('open');
  ritualModal.setAttribute('aria-hidden', 'true');
}
window.openCardRitual = openCardRitual;
window.closeCardRitual = closeCardRitual;

function drawCard(cardEl) {
  cardEl.classList.add('drawing');
  const others = deckEl.querySelectorAll('.deck-card:not(.drawing)');
  others.forEach((c, i) => {
    c.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    c.style.opacity = '0.3';
    c.style.pointerEvents = 'none';
  });
  chosenCard = cards[Math.floor(Math.random() * cards.length)];
  setTimeout(() => {
    if (deckEl) deckEl.style.display = 'none';
    revealCard(chosenCard);
  }, 1000);
}

function revealCard(c) {
  document.getElementById('resultSymbol').textContent = c.symbol;
  document.getElementById('resultName').textContent = c.name;
  document.getElementById('resultSub').textContent = c.sub;
  document.getElementById('resultTitle').textContent = c.name;
  document.getElementById('resultMeaning').textContent = c.meaning;
  ritualResult.classList.add('open');
  ritualResult.setAttribute('aria-hidden', 'false');
}

function bringCardToChat() {
  if (!chosenCard) return;
  closeCardRitual();
  setTimeout(() => {
    appendBubble('user', `<p><em>I pulled a card.</em> <strong style="color:var(--gold-soft);">${chosenCard.symbol} ${chosenCard.name}</strong></p>`);
    const typing = appendTyping();
    setTimeout(() => {
      typing?.remove();
      const followUp = oracleCardResponse(chosenCard);
      appendBubble('bot', `<p>${followUp}</p>`);
    }, 1100);
  }, 350);
}
window.bringCardToChat = bringCardToChat;

function oracleCardResponse(c) {
  const intros = [
    `Ah. <em>${c.name}</em>. The deck rarely speaks this clearly.`,
    `<em>${c.name}</em> — yes. I wondered if it would come tonight.`,
    `So it's <em>${c.name}</em>. A heavier card than it looks.`,
    `The <em>${c.name}</em>. Of course. Of course it is.`,
  ];
  const intro = intros[Math.floor(Math.random() * intros.length)];
  return `${intro} ${c.meaning} What did you feel when you turned it?`;
}

/* ---------- Smooth anchor scroll ---------- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id.length > 1) {
      const el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});

/* ---------- Reveal-on-scroll for sections ---------- */
const io = 'IntersectionObserver' in window
  ? new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0)';
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 })
  : null;

if (io) {
  document.querySelectorAll('.feature-card, .price-card, .faq-item, .section-head, .preview-frame, .cta-inner').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.7s cubic-bezier(0.2, 0.9, 0.3, 1), transform 0.7s cubic-bezier(0.2, 0.9, 0.3, 1)';
    io.observe(el);
  });
}
