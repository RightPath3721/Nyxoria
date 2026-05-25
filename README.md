# Nyxoria — Sample Dark AI Chatbot

A fully self-contained demo built to match the brief for an **atmospheric, dark, mysterious AI chatbot** with deep-purple and gold accents, a freemium pricing model, and an interactive engagement mechanic (card-pull ritual).

This is a static showcase — no build step, no dependencies. Open `index.html` in a browser and everything works.

## What's inside

| File | Purpose |
|------|---------|
| `index.html` | Landing page: hero, features, embedded chat preview, pricing, FAQ, CTA, footer, auth modal |
| `chat.html` | The product itself: sidebar with reading history, chat feed, composer, card-pull ritual |
| `styles.css` | Single dark-theme stylesheet (obsidian black, deep violet, antique gold) |
| `script.js` | Animated starfield, chat logic, card-pull ritual, modals, responsive nav |

## How it matches the brief

- **Dark, mysterious, elegant UI** — black + deep purple + gold, Cinzel/Cormorant serif typography, candlelit feel
- **Main chat interface** — sidebar, oracle persona, voice/text composer, typing indicator
- **Interactive engagement feature** — animated card-pull ritual (10-card mystic deck) that flows back into the conversation
- **Authentication UI** — sign-in / sign-up modal with email + Google option
- **Subscription / freemium pricing** — three tiers (Initiate free / Seeker $12 / Oracle $29), Stripe-style copy
- **Landing page** — hero with tagline, embedded screenshot mock, pricing, FAQ, CTAs
- **Mobile-responsive** — fully responsive down to 360px (collapsible sidebar, stacked grids)
- **Consistent AI persona** — Nyxoria stays in character across all scripted replies

## How to demo to the client

1. Open `index.html` — walk through the landing page
2. Click **"Enter the Veil"** or **"Begin your reading"** to open the chat
3. In the chat, click any starter chip or **"Pull a card"** to trigger the ritual animation
4. After drawing, click **"Bring this card into the reading"** — the oracle responds in character

## Notes for production

This is a **front-end design sample only**. A real build would plug in:
- **Claude 3.5 Sonnet** (or Grok) for the oracle responses, with a system prompt enforcing persona
- **Supabase / Firebase** for auth + chat history persistence
- **Stripe** for the subscription tiers
- The chosen no-code stack (**Bubble.io** or **FlutterFlow**) would re-create these screens with bound data
