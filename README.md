# EcoResolve — Turn Waste Into Worth

> AI-powered circular economy platform · React Native + Expo · Firebase

---

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (Mac) or Android Emulator / physical device

### Setup

```bash
# 1. Install dependencies
cd ecoresolve
npm install

# 2. Configure environment
cp .env.example .env
# Fill in your Firebase credentials in .env

# 3. Start the dev server
npx expo start

# 4. Run on device
# Press 'i' for iOS simulator
# Press 'a' for Android emulator
# Scan QR code with Expo Go app for physical device
```

---

## Firebase Setup

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** (Email/Password, Google, Phone)
3. Create a **Firestore** database (start in test mode)
4. Enable **Storage**
5. Copy your config values to `.env`

---

## Project Structure

```
ecoresolve/
├── app/                    # Expo Router screens
│   ├── (auth)/             # Auth flow (welcome, login, signup, otp, role-select)
│   ├── (tabs)/             # Main tabs (home, community, marketplace, profile)
│   ├── drives/             # Drive detail + create
│   ├── marketplace/        # Listing, store, waste detail screens
│   └── onboarding/         # Startup setup
├── components/
│   ├── ui/                 # Design system components
│   └── AIAssistant.tsx     # AI chat modal
├── constants/              # Colors, spacing, types
├── hooks/                  # Custom hooks (auth, haptic, drift animation)
├── services/               # Firebase auth + Firestore services
└── stores/                 # Zustand state (auth, ui, ai)
```

---

## Design System

- **Background:** `#0A0A0B` (Void Black)
- **Primary:** `#00F2FF` (Electric Cyan)
- **Accent:** `#7000FF` (Neon Purple)
- **Success:** `#00FF9D` · **Warning:** `#FFB800` · **Error:** `#FF3B5C`
- **Style:** Futuristic AI · Deep Space · Zero Gravity

---

## Development Phases

| Phase | Status | Description |
|-------|--------|-------------|
| Phase 1 | ✅ **Complete** | Auth flow + navigation shell + design system |
| Phase 2 | ✅ **Complete** | Live Firestore · Drives service · Leaderboard · Create drive · Location |
| Phase 3 | � Next | Organizer dashboard · Waste upload · Drive management |
| Phase 4 | 📋 Planned | Marketplace · Startup stores · Stripe payments |
| Phase 5 | 📋 Planned | Token system + payments |
| Phase 6 | 📋 Planned | AI verification + analytics |
| Phase 7 | 📋 Planned | Polish + App Store submission |

---

## Key Dependencies

| Package | Purpose |
|---------|---------|
| `expo-router` | File-based navigation |
| `react-native-reanimated` | 60fps animations |
| `firebase` | Auth, Firestore, Storage |
| `zustand` | State management |
| `@tanstack/react-query` | Server state + caching |
| `phosphor-react-native` | Icon library |
| `react-hook-form` + `zod` | Form validation |

---

*EcoResolve — Turn Waste Into Worth*
