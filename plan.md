# EcoResolve — Implementation Plan
> **Tagline:** Turn Waste Into Worth
> **Quality Target:** App Store / Play Store ready · Investor presentation ready

---

## 1. Vision & Core Concept

EcoResolve is a premium AI-powered circular economy platform that connects:
- **Volunteers** — collect waste at drives, earn tokens
- **Organizers** — manage drives, upload/sell waste
- **Startups** — buy verified waste, sell recycled products

Tokens release only when waste is sold and payment is confirmed — creating a trustworthy, end-to-end circular economy loop.

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native + Expo (SDK 51+) |
| Navigation | Expo Router v3 (file-based) + Bottom Tabs |
| State Management | Zustand + React Query |
| Backend | Firebase (Auth, Firestore, Storage, Functions) |
| Animations | Reanimated 3 + Moti |
| UI System | Custom Design System (Futuristic AI · Frosted Space-Glass · Zero-Gravity) |
| Icons | Phosphor Icons / Lucide React Native |
| Typography | Inter (via Expo Google Fonts) |
| Payments | Stripe SDK (React Native) |
| AI | Firebase ML + Google Vision API |
| Maps | Expo Maps / React Native Maps |
| Push Notifications | Expo Notifications + FCM |
| Analytics | Firebase Analytics |

---

## 3. Project Architecture

```
ecoresolve/
├── app/                        # Expo Router screens
│   ├── (auth)/                 # Auth flow
│   │   ├── welcome.tsx
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   ├── otp.tsx
│   │   └── role-select.tsx
│   ├── (tabs)/                 # Main bottom tabs
│   │   ├── index.tsx           # Home
│   │   ├── community.tsx       # Community
│   │   ├── marketplace.tsx     # Marketplace
│   │   └── profile.tsx         # Profile
│   ├── drives/
│   │   ├── [id].tsx            # Drive detail
│   │   └── create.tsx          # Organizer: create drive
│   ├── marketplace/
│   │   ├── listing/[id].tsx
│   │   ├── store/[id].tsx
│   │   └── waste/[id].tsx
│   ├── onboarding/
│   │   └── startup-setup.tsx
│   └── _layout.tsx
├── components/
│   ├── ui/                     # Atomic design components
│   ├── cards/                  # Card variants
│   ├── animations/             # Reusable animated wrappers
│   └── forms/                  # Form components
├── stores/                     # Zustand stores
├── hooks/                      # Custom hooks
├── services/                   # Firebase / API services
├── constants/                  # Colors, spacing, types
├── utils/                      # Helpers, formatters
└── assets/                     # Images, icons, fonts
```

---

## 4. Design System

> **Design Language:** Futuristic AI Interface · Deep Space · Zero Gravity

### Color Palette
```
── Core Backgrounds ──────────────────────────────────────
Void Black:       #0A0A0B  (Deep Obsidian — primary background)
Depth Layer:      #0D0D10  (Slightly lifted surface)
Elevated Surface: #121218  (Widget / card layer)

── Primary Accent ────────────────────────────────────────
Electric Cyan:    #00F2FF  (Primary brand, interactive nodes, CTA)
Cyan Glow:        rgba(0, 242, 255, 0.20) (Ambient aura)
Cyan Dim:         rgba(0, 242, 255, 0.08) (Subtle highlight)

── Glow Accent ───────────────────────────────────────────
Neon Purple:      #7000FF  (Secondary accent, decorative glow)
Purple Aura:      rgba(112, 0, 255, 0.25) (Bloom effect)
Purple Rim:       rgba(112, 0, 255, 0.12) (Border shimmer)

── Text Hierarchy ────────────────────────────────────────
Primary Text:     #F0F0FF  (Near-white, high contrast)
Secondary Text:   rgba(240, 240, 255, 0.55)
Muted Text:       rgba(240, 240, 255, 0.28)

── Semantic ──────────────────────────────────────────────
Success:          #00FF9D  (Neon mint)
Warning:          #FFB800  (Amber pulse)
Error:            #FF3B5C  (Neon red)
Info:             #00F2FF  (Cyan — same as primary)

── Glassmorphism Surface ─────────────────────────────────
Frost Light:      rgba(255, 255, 255, 0.04)
Frost Mid:        rgba(255, 255, 255, 0.07)
Frost Heavy:      rgba(255, 255, 255, 0.10)
Frost Border:     rgba(255, 255, 255, 0.08)
```

### Spacing Grid
`4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96`

### Border Radius
```
Node (ring):  50%      (circular haptic-ring nodes)
Widget:       20px     (floating organic widgets)
Panel:        28px     (expanded glassmorphic panels)
Pill:         999px    (badges / chips)
Input:        12px
```

### Glow & Shadow System
```
── Cyan Glow (Primary Interactions) ──────────────────────
Node Idle:    0 0 12px rgba(0,242,255,0.30)
Node Hover:   0 0 28px rgba(0,242,255,0.60), 0 0 60px rgba(0,242,255,0.20)
CTA Active:   0 0 40px rgba(0,242,255,0.80)

── Purple Bloom (Decorative / Ambient) ───────────────────
Ambient:      0 0 80px rgba(112,0,255,0.15)
Deep Bloom:   0 0 120px rgba(112,0,255,0.25)

── Frosted Float (Widget Depth) ──────────────────────────
Z-1 (base):   0 4px 24px rgba(0,0,0,0.40)
Z-2 (mid):    0 12px 40px rgba(0,0,0,0.55)
Z-3 (top):    0 24px 64px rgba(0,0,0,0.70)
```

### Layout Philosophy — Organic Floating Z-Axis
> Abandon traditional top-nav/sidebar grids. Use a **decentralized, organic layout** where every widget floats at a unique Z-depth, creating a sense of three-dimensional depth without rigid columns or rows.

```
Depth Layers:
  Z-0  →  Void background (ambient animated gradient)
  Z-1  →  Large ambient orbs / background glows (blur: 80px)
  Z-2  →  Primary content widgets (float with micro-drift)
  Z-3  →  Interactive haptic-ring nodes
  Z-4  →  Expanded glassmorphic panels (on interaction)
  Z-5  →  Toast / overlay overlays

Positioning Rules:
  • No strict grid — widgets use absolute/free-flow positioning
  • Varying margin offsets to break visual symmetry
  • Overlapping Z-layers encouraged for depth perception
  • All widgets have independent micro-drift phase offsets
```

### Component Library — Futuristic AI Interface

#### `HapticRingNode`
> The replacement for all standard buttons.
- **Idle state:** Circular ring, 1–2px Electric Cyan border, subtle cyan inner glow
- **Hover state:** Ring expands outward (scale 1.2), glow intensifies, background bloom activates
- **On expand:** Glassmorphic panel slides/fades in from the node origin
- **On press:** Haptic feedback (Expo Haptics) + quick cyan pulse burst
- Ring sizes: `xs (40px) · sm (56px) · md (72px) · lg (96px)`

#### `FrostPanel`
> Glassmorphic content panel — the primary container element.
- `backdrop-filter: blur(30px)` — **mandatory on all translucent surfaces**
- Background: `Frost Mid` or `Frost Heavy` depending on Z-level
- Border: `1px solid rgba(255,255,255,0.08)` with subtle cyan rim highlight
- Inner glow: faint Purple Aura bloom on bottom-right corner
- Appearance animation: spring scale from `0.92` → `1.0` + fade in

#### `DriftWidget`
> Wrapper that applies the zero-gravity micro-drift animation.
- Each widget receives a randomized phase offset (0–2π) and amplitude (3–8px)
- Drift is a smooth sinusoidal Y + slight X oscillation (see Animation System)
- Never pauses — constant, subtle, alive

#### `CyanOrb`
> Large ambient background decorative element.
- Radial gradient: cyan core → transparent edge
- Applies heavy blur (60–100px) at Z-1 layer
- Slow rotation + drift — purely decorative depth

#### `NeonRing` (decorative)
> Animated ring used as accent behind nodes or section headers.
- Thin (1px) rotating ring with electric cyan color
- Dash-animated border for a scanning/radar aesthetic

#### `TokenPulseOrb`
> Token balance display widget.
- Circular orb with pulsing cyan glow tied to balance value
- Inner counter uses monospaced font with number-roll animation

#### `ProgressArc`
> Replaces linear progress bars — animated SVG arc.
- Stroke color: Electric Cyan with glow filter
- Background stroke: Frost Border
- Animates from 0 on mount

#### `SkeletonDrift`
> Shimmer skeleton loader matching the dark palette.
- Background: `Frost Light` base with a sweeping `rgba(0,242,255,0.05)` shimmer
- Applies micro-drift even in loading state (feels alive)

#### `BadgeNode`
> Achievement badge displayed as a small haptic-ring node variant.
- Locked: muted purple glow
- Unlocked: burst animation — ring expands and collapses with cyan pulse

---

## 5. Animation System

> **Philosophy:** The UI is never static. Every element breathes, drifts, or glows. Zero-gravity is a constant state, not a transition.

### 🌌 Micro-Drift — Zero Gravity (Global, Always-On)
> Applied to **every widget** via the `DriftWidget` wrapper. This is the signature animation of the entire interface.

```
Formula:
  translateY = amplitude * sin(time * speed + phaseOffset)
  translateX = (amplitude * 0.4) * cos(time * speed * 0.7 + phaseOffset)

Parameters per widget (randomized on mount):
  amplitude:    3px – 8px
  speed:        0.0004 – 0.0008 (radians/ms)
  phaseOffset:  0 – 2π (so widgets drift out of sync)

Implementation:
  • Reanimated 3 `useAnimatedStyle` + `useSharedValue`
  • Driven by a single global `useClock()` shared value
  • Never pauses — runs on UI thread only (no JS bridge)
  • Respects `prefers-reduced-motion` (amplitude → 0 gracefully)
```

### ⚡ Haptic Ring Node Interactions
| State | Animation | Duration |
|---|---|---|
| Idle | Micro-drift + idle cyan glow pulse | Loop |
| Hover enter | Ring scale 1.0 → 1.25, glow intensity ↑, bloom activates | 280ms spring |
| Panel expand | FrostPanel origin-scale 0.88 → 1.0 + fade in | 380ms spring (mass 0.75) |
| Press | Scale 0.93 → 1.0 snap + cyan burst radiate | 120ms + 300ms |
| Hover exit | Ring scale back, bloom fades, panel collapses | 220ms ease-in |

### 🔄 Page & Navigation Transitions
| Interaction | Animation | Duration |
|---|---|---|
| Page enter | Drift-aware fade + Y slide (20px → 0) | 350ms ease-out |
| Page exit | Fade + slight Y rise (0 → -12px) | 250ms ease-in |
| Tab switch | Crossfade + subtle depth shift | 280ms |
| Modal / Panel open | Spring scale from node origin | Spring (mass 0.8) |
| Modal close | Collapse back to node + fade | 220ms ease-in |

### ✨ Global Element Animations
| Element | Animation | Duration |
|---|---|---|
| Content reveal | Staggered drift-in (opacity 0→1 + Y 24→0) | 400ms, 80ms stagger |
| Counter / balance | Number roll (Reanimated derived value) | 900ms ease-out |
| ProgressArc | SVG stroke-dashoffset unwind from 0 | 1000ms ease-out |
| Skeleton loader | Cyan shimmer sweep across frost surface | Loop 1.6s |
| Neon border ring | Slow dash rotation | Loop 4s linear |
| CyanOrb (background) | Slow rotation + drift (Z-1 layer) | Loop 20–30s |
| TokenPulseOrb | Scale pulse 1.0 → 1.06 → 1.0 | Loop 2.4s |
| Error / Warning state | Rapid cyan → red rim flash | 3 pulses, 200ms each |

### 📱 Page-Specific Animations
- **Home**: Ambient `CyanOrb` rotates in background. Hero text reveals with character-staggered drift-in. Stats count up. Nearby drive nodes orbit around a central `HapticRingNode`.
- **Community**: Active drive cards have a living green-to-cyan pulse border. Join success triggers a radial burst of ECT token particles from the node. Leaderboard rank changes animate with a vertical slide + number roll.
- **Marketplace**: Product `FrostPanel` nodes expand on hover from their origin point. Purchase success fires a full-screen bloom (cyan) that fades after 600ms. Filter panel slides in from a ring node as a `FrostPanel` overlay.
- **Profile**: `TokenPulseOrb` glows on wallet section. Badge unlock triggers a ring-expand burst + confetti particles in cyan/purple. Role-switcher morphs the background ambient gradient between role-specific tones.
- **AI Assistant**: Chat bubbles drift in from the bottom with micro-drift applied immediately. Typing indicator is a three-dot `CyanOrb` micro-oscillation. Response text reveals character-by-character.

---

## 6. Firebase Data Schema

### Collections

```
users/{uid}
  - name, email, phone, photoURL, coverURL
  - roles: ['volunteer','organizer','startup']
  - activeRole: string
  - tokens: number (escrow)
  - releasedTokens: number
  - rank: number
  - badges: string[]
  - createdAt: timestamp

drives/{driveId}
  - organizerId, title, description
  - date, time, location (GeoPoint)
  - targetWasteKg, fundGoal, volunteersNeeded
  - volunteersJoined: string[]
  - fundsCollected, wasteCollected
  - status: 'upcoming'|'active'|'completed'
  - photos: string[]

wasteListings/{listingId}
  - organizerId, driveId
  - type: 'plastic'|'paper'|'metal'|'glass'|'ewaste'|'organic'
  - quantity (kg), condition, price
  - photos: string[]
  - location (GeoPoint)
  - status: 'available'|'sold'|'pending'
  - contributingVolunteers: {uid: tokenShare}

startupStores/{storeId}
  - ownerId, name, logo, description
  - categories, location
  - subscriptionTier, subscriptionExpiry
  - verified: boolean

products/{productId}
  - storeId, name, description
  - price, inventory
  - photos, category
  - isBestseller, tags

orders/{orderId}
  - buyerId, sellerId
  - listingId (waste or product)
  - amount, status
  - paymentIntentId
  - createdAt

proofPhotos/{photoId}
  - volunteerId, driveId
  - photoURL, aiVerified
  - duplicateScore, fakeScore
  - wasteCategory, quantityEstimate
  - uploadedAt

notifications/{notifId}
  - userId, type, message
  - relatedId, read
  - createdAt
```

---

## 7. Development Phases

---

### Phase 1 — Foundation & Auth (Week 1–2)

**Goal:** Working auth flow + role selection + navigation shell

#### Tasks
- [ ] Initialize Expo project with TypeScript
- [ ] Configure Expo Router v3 file-based routing
- [ ] Set up Firebase project (Auth, Firestore, Storage)
- [ ] Implement Design System tokens (colors, spacing, typography)
- [ ] Build auth screens:
  - Welcome / splash screen with animated logo
  - Google Sign-In (Expo Auth Session)
  - Email/password signup + login
  - Mobile + OTP login (Firebase Phone Auth)
  - Username creation screen
  - Profile photo upload (Expo Image Picker)
- [ ] Role selection screen (multi-select: Volunteer / Organizer / Startup)
- [ ] Role stored in Firestore `users/{uid}`
- [ ] Bottom tab navigator shell (4 tabs)
- [ ] Auth state persistence (Zustand + AsyncStorage)
- [ ] Protected route guard (redirect if not authed)

**Deliverable:** Full auth flow → role select → blank tab screens

---

### Phase 2 — Home & Community (Week 3–5)

**Goal:** Live home dashboard + community drives browsing & joining

#### Home Screen
- [ ] Hero section: animated 3D recycle orb (Reanimated 3 + Lottie or Three.js via WebView)
- [ ] Cinematic tagline reveal animation
- [ ] Live impact stats counters (total kg collected, tokens distributed, drives completed)
- [ ] Nearby drives carousel (Firestore geoqueries)
- [ ] Featured startup products horizontal scroll
- [ ] Token streak tracker widget
- [ ] Urgent drives section (drives within 48hrs)
- [ ] Verified partner badges row
- [ ] Skeleton loaders for all async sections

#### Community Screen
- [ ] Live drives list (real-time Firestore listener)
  - Volunteer count, progress bar, time remaining
  - Live green pulse on active drives
- [ ] Drive detail page:
  - Map view (location)
  - Volunteer list
  - Join drive (1-tap) → haptic feedback + success animation
  - Donate funds / equipment toggle
- [ ] Volunteer leaderboard with rank animations
- [ ] Upcoming drives calendar view
- [ ] Follow organizers
- [ ] Impact posts feed (simple social feed)
- [ ] Pull-to-refresh on all lists

**Deliverable:** Home with live data + community browsing + drive joining

---

### Phase 3 — Organizer Dashboard & Waste Upload (Week 6–8)

**Goal:** Organizer role fully functional

#### Drive Creation
- [ ] Drive creation form:
  - Title, description, date/time picker
  - Location picker (map tap or search)
  - Volunteers needed, target waste (kg)
  - Funds needed, equipment needed
- [ ] Drive editing + cancellation
- [ ] Volunteer tracking list
- [ ] Drive status updates (upcoming → active → completed)

#### Waste Upload Interface
- [ ] Multi-photo upload (Expo Image Picker + Firebase Storage)
- [ ] Waste listing form:
  - Type selector (plastic, paper, metal, glass, e-waste, organic)
  - Quantity (kg), condition (clean/mixed/contaminated)
  - Price input
  - Pickup location
  - Link to drive
- [ ] Waste listings management (edit, delete, mark sold)
- [ ] Earnings tracker (total sold, pending payment)
- [ ] Notification when startup purchases listing

**Deliverable:** Organizers can create drives + upload/manage waste listings

---

### Phase 4 — Marketplace & Startup Stores (Week 9–12)

**Goal:** Full marketplace with waste buying + product selling

#### Startup Onboarding Flow
- [ ] Subscription gate (Stripe paywall — monthly/annual tiers)
- [ ] Step 1 — Store setup:
  - Name, logo upload, description
  - Contact + social links
  - Location, categories
- [ ] Step 2 — Add initial products

#### Marketplace Screen
- [ ] Store listings with verified badges
- [ ] Waste listings feed:
  - Type, quantity, price, condition
  - Distance from user
  - Seller organizer profile card
  - Purchase button
- [ ] Product marketplace (recycled goods)
- [ ] Search bar + filter panel (slide animation):
  - Type, location radius, price range, condition
- [ ] Bestseller tags, featured placements

#### Startup Dashboard
- [ ] Store management (add/edit products, pricing, inventory)
- [ ] Waste buying hub:
  - Browse organizer listings with filters
  - Purchase flow (Stripe)
  - Logistics option (EcoResolve transport)
- [ ] Order management
- [ ] Sales analytics (charts — Victory Native or Gifted Charts)

#### Post-Purchase Flow
- [ ] Firebase Cloud Function triggers on order completion:
  1. Mark listing as SOLD
  2. Notify organizer
  3. Process payment (Stripe)
  4. Release tokens to volunteers (proportional shares)

**Deliverable:** End-to-end marketplace + complete token release loop

---

### Phase 5 — Token System & Payments (Week 13–14)

**Goal:** Token economy fully wired end-to-end

#### Token Rules Engine (Firebase Cloud Functions)
- [ ] `onDriveJoin` — reserve token allocation for volunteer
- [ ] `onProofVerified` — mark contribution as verified
- [ ] `onWasteSold` — release tokens proportionally
- [ ] `onPaymentConfirmed` (Stripe webhook) — finalize token release

#### Token Wallet (Profile)
- [ ] Escrow balance (locked) vs. released balance
- [ ] Transaction history log
- [ ] Glowing pulse animation on wallet card
- [ ] Token value display (tied to waste sale price)

#### Payments
- [ ] Stripe setup (merchant + customer flows)
- [ ] Subscription billing for startup stores
- [ ] Waste purchase payments
- [ ] Logistics fee calculation
- [ ] Marketplace commission (% deducted via Cloud Function)

**Deliverable:** Complete token + payment system

---

### Phase 6 — AI Verification & Analytics (Week 15–17)

**Goal:** AI proof verification + analytics dashboards

#### Volunteer Proof Upload
- [ ] Multi-photo upload at drive
- [ ] AI verification pipeline (Firebase Extension or Cloud Function):
  - Duplicate photo detection (perceptual hashing)
  - Fake/stock photo detection (Google Vision SafeSearch)
  - Waste category recognition (AutoML or Vision API labels)
  - Quantity estimation (object detection)
- [ ] Verification status feedback to volunteer (approved / rejected / manual review)

#### Analytics Dashboards
- [ ] Organizer: waste sold stats, volunteer performance, earnings charts
- [ ] Startup: purchase history, inventory usage, product sales
- [ ] Platform-wide impact stats (home screen counters)
- [ ] Volunteer: personal contribution history + badges earned

**Deliverable:** AI-verified contributions + analytics for all roles

---

### Phase 7 — Polish, Performance & Launch Prep (Week 18–20)

**Goal:** App Store / Play Store ready

#### Performance
- [ ] 60fps audit on all animations (Reanimated worklets only)
- [ ] Lazy loading + list virtualization (FlashList)
- [ ] Image caching (Expo Image)
- [ ] Firestore query optimization + indexes
- [ ] Bundle size audit (tree shaking)
- [ ] Reduced motion support (accessibility)

#### UX Polish
- [ ] Haptic feedback on all key actions (Expo Haptics)
- [ ] Zero dead-end states — every error has a recovery path
- [ ] Clear empty states with illustrations
- [ ] Onboarding tooltips for first-time users
- [ ] Push notification flows (drive reminders, token releases, purchase alerts)
- [ ] Deep linking support

#### Quality Assurance
- [ ] End-to-end flow testing (all 3 roles)
- [ ] Offline graceful degradation
- [ ] Dark mode support (optional stretch goal)
- [ ] Security rules audit (Firestore + Storage)
- [ ] App Store metadata + screenshots
- [ ] Privacy policy + terms of service screens

**Deliverable:** Submission-ready builds for iOS and Android

---

## 8. Screen Inventory

| Screen | Role | Priority |
|---|---|---|
| Welcome / Splash | All | P0 |
| Login / Signup / OTP | All | P0 |
| Role Selection | All | P0 |
| Home Dashboard | All | P0 |
| Community — Drive List | All | P0 |
| Drive Detail | All | P0 |
| Marketplace | All | P0 |
| Profile | All | P0 |
| Drive Creation | Organizer | P1 |
| Waste Upload | Organizer | P1 |
| Organizer Dashboard | Organizer | P1 |
| Startup Onboarding | Startup | P1 |
| Startup Dashboard | Startup | P1 |
| Waste Buying Hub | Startup | P1 |
| Token Wallet | Volunteer | P1 |
| Proof Upload | Volunteer | P1 |
| Leaderboard | All | P2 |
| Impact Feed | All | P2 |
| Analytics | Organizer/Startup | P2 |
| Notifications | All | P2 |
| Settings | All | P3 |

---

## 9. Token Economy Rules

```
1. Volunteer joins drive         → token slot reserved (pending)
2. Volunteer uploads proof       → AI verifies → slot confirmed
3. Organizer lists waste         → waste linked to drive + volunteers
4. Startup purchases waste       → order created (PENDING)
5. Payment confirmed (Stripe)    → Cloud Function fires
6. Tokens released               → proportional to each volunteer's contribution
7. Token value                   → derived from waste sale price per kg
```

> Tokens are NOT direct currency. They are held in escrow until Step 5.

---

## 10. Business Model

| Revenue Stream | Implementation |
|---|---|
| Startup subscriptions | Stripe Billing (monthly/annual) |
| Logistics fees | Calculated per order weight + distance |
| Featured listings | Paid boost flag on waste/product listings |
| Marketplace commission | % deducted via Stripe Connect |
| Premium analytics | Subscription tier gate |

---

## 11. Key Dependencies

```json
{
  "expo": "~51.0.0",
  "expo-router": "^3.0.0",
  "react-native-reanimated": "^3.0.0",
  "moti": "^0.28.0",
  "firebase": "^10.0.0",
  "zustand": "^4.5.0",
  "@tanstack/react-query": "^5.0.0",
  "expo-auth-session": "^5.0.0",
  "expo-image-picker": "^15.0.0",
  "expo-haptics": "^13.0.0",
  "expo-notifications": "^0.28.0",
  "@stripe/stripe-react-native": "^0.37.0",
  "react-native-maps": "^1.10.0",
  "@shopify/flash-list": "^1.6.0",
  "phosphor-react-native": "^2.0.0",
  "victory-native": "^40.0.0"
}
```

---

## 12. Milestones & Timeline

| Phase | Weeks | Milestone |
|---|---|---|
| Phase 1 | 1–2 | Auth + navigation shell live |
| Phase 2 | 3–5 | Home + Community functional |
| Phase 3 | 6–8 | Organizer dashboard + waste upload |
| Phase 4 | 9–12 | Full marketplace + startup stores |
| Phase 5 | 13–14 | Token system + payments wired |
| Phase 6 | 15–17 | AI verification + analytics |
| Phase 7 | 18–20 | Polish + App Store submission |

**Total estimated timeline: 20 weeks (5 months)**

---

## 13. Quality Checklist (Pre-Launch)

- [ ] All 3 role flows work end-to-end without errors
- [ ] No placeholder screens or dummy data in production build
- [ ] 60fps on all animations (tested on mid-range Android)
- [ ] All errors have recovery paths
- [ ] Push notifications delivered for all key events
- [ ] Stripe payments tested in live mode
- [ ] AI verification tested with real photos
- [ ] Firestore security rules block unauthorized access
- [ ] App Store screenshots + metadata complete
- [ ] Privacy policy + terms linked in-app

---

## 14. EcoResolve AI Assistant

The in-app AI companion that guides every user toward meaningful eco action.

### Identity
- **Name:** EcoResolve AI
- **Tone:** Friendly, motivating, slightly energetic — like a coach, not a robot
- **Language:** Simple English + Hinglish mix when needed
- **Response length:** 3–6 lines max (unless user asks for detail)

---

### Core Responsibilities

| # | Responsibility | Example Action |
|---|---|---|
| 1 | Find nearby cleanup drives | Suggest drives by location, highlight urgent ones |
| 2 | Guide waste management | Explain disposal of plastic, e-waste, etc. + suggest nearest drop-off |
| 3 | Explain tokens & rewards | How tokens are earned, when released, tips to earn more |
| 4 | Assist organizers | Best drive timing, volunteer counts, participation tips |
| 5 | Help startups | Suggest profitable waste materials, demand insights |
| 6 | Motivate & gamify | Encourage streaks, suggest missions, celebrate achievements 🎉 |

---

### Smart Behavior Rules
- Always give **actionable suggestions** — not just information
- **Personalize** using user context (role, location, history) if available
- Always suggest a **next step** after every answer
- Prioritize **nearby drives** with distance when location is available
- Use **bullet points or short lines** — avoid paragraphs
- Add **light emojis** (🌱 ♻️ 🔥) — don't overuse

---

### Response Style

**Do:**
- Short, punchy answers
- Bullet-point format
- End with a call to action
- Mention distance to nearest drive when relevant

**Avoid:**
- Long paragraphs
- Technical jargon
- Generic answers ("Plastic can be recycled")
- Negative or discouraging tone

---

### Example Conversations

**User:** "Mere paas plastic waste hai kya karu?"
```
Nice 👍 you can recycle it ♻️
• Nearby drive available 1.5 km away
• You'll earn tokens after verification
Want me to help you join?
```

**User:** "Tokens kab milte hai?"
```
Tokens instantly show ho jate hain 👀
But unlock tab hote hain jab waste sell hota hai 💰
Tip: Clean + sorted waste = more value 🔥
```

**User:** "Drive create karna hai"
```
Great initiative 🌱
• Best time: Weekend morning
• Keep 10–15 volunteers
• Add clear location + goal
Want me to help you set it up?
```

---

### Location Awareness
- Always prioritize drives closest to user's current location
- Mention distance in responses (e.g. "1.5 km away")
- Suggest the **closest + highest impact** option first

---

### AI Screen Placement

| Location | AI Trigger |
|---|---|
| Home tab | Floating AI button (bottom-right) |
| Community tab | "Find a drive near me" quick prompt |
| Marketplace tab | "What waste should I buy?" prompt |
| Organizer dashboard | "Help me create a drive" prompt |
| Profile / Wallet | "How do I earn more tokens?" prompt |

---

### Implementation Notes
- Built as a modal/bottom-sheet overlay accessible from all screens
- Maintains conversation context within a session (Zustand store)
- Integrates with Firestore to read user role, location, nearby drives in real-time
- Powered by a backend Cloud Function calling an LLM (Gemini API) with injected system prompt + live user context
- Supports quick-reply chips for common actions

---

### System Prompt Injection (Runtime Context)
```
User role: {activeRole}
Location: {lat, lng}
Nearby drives: {driveList}
Token balance: {escrow} locked / {released} released
Recent activity: {lastDrive, lastUpload}
```

---

### Ultimate Goal
> Turn every user into an active eco contributor by guiding them to:
> → Join drives → Upload waste → Earn tokens → Build real-world impact
>
> **Always push toward action.**

---

*EcoResolve — Turn Waste Into Worth*
