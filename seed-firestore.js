/**
 * EcoResolve — Firestore Seed Script
 * Run with: node scripts/seed-firestore.js
 *
 * Requires: GOOGLE_APPLICATION_CREDENTIALS env var pointing to your
 * Firebase service account JSON, or run `firebase login` first.
 *
 * Usage:
 *   npm install -g firebase-tools
 *   firebase login
 *   node scripts/seed-firestore.js
 */

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, GeoPoint } = require('firebase-admin/firestore');

// Initialize with default credentials (firebase login must be done)
initializeApp({ projectId: process.env.FIREBASE_PROJECT_ID || 'YOUR_PROJECT_ID' });

const db = getFirestore();

async function seed() {
  console.log('🌱 Seeding Firestore...\n');

  // ── Platform Stats ──────────────────────────────────────────────────────────
  await db.doc('platform/stats').set({
    totalKgCollected: 142830,
    tokensDistributed: 89420,
    drivesCompleted: 1247,
    updatedAt: Timestamp.now(),
  });
  console.log('✅ Platform stats seeded');

  // ── Drives ──────────────────────────────────────────────────────────────────
  const drives = [
    {
      organizerId: 'seed-organizer-1',
      organizerName: 'GreenMumbai NGO',
      title: 'Juhu Beach Cleanup',
      description:
        "Join us for a massive beach cleanup at Juhu! We'll be collecting plastic waste, glass, and other debris. All equipment provided. Earn ECT tokens for every kg collected.",
      date: Timestamp.fromDate(new Date('2025-01-26T08:00:00')),
      time: '8:00 AM – 12:00 PM',
      location: new GeoPoint(19.099, 72.8265),
      locationAddress: 'Juhu Beach, Mumbai, Maharashtra',
      targetWasteKg: 200,
      fundGoal: 10000,
      volunteersNeeded: 30,
      volunteersJoined: [],
      fundsCollected: 4500,
      wasteCollected: 0,
      status: 'upcoming',
      photos: [],
    },
    {
      organizerId: 'seed-organizer-2',
      organizerName: 'EcoWarriors',
      title: 'Bandra Recycle Run',
      description:
        'Active cleanup drive at Bandra Bandstand. Earn double tokens today! Bring gloves and enthusiasm.',
      date: Timestamp.fromDate(new Date()),
      time: '4:00 PM – 7:00 PM',
      location: new GeoPoint(19.0544, 72.8197),
      locationAddress: 'Bandra Bandstand, Mumbai',
      targetWasteKg: 100,
      fundGoal: 8000,
      volunteersNeeded: 15,
      volunteersJoined: [],
      fundsCollected: 8000,
      wasteCollected: 45,
      status: 'active',
      photos: [],
    },
    {
      organizerId: 'seed-organizer-1',
      organizerName: 'LakeGuardians',
      title: 'Powai Lake Drive',
      description:
        'Help us restore the beauty of Powai Lake. We will collect plastic and organic waste from the lake banks.',
      date: Timestamp.fromDate(new Date('2025-02-01T07:00:00')),
      time: '7:00 AM – 11:00 AM',
      location: new GeoPoint(19.1176, 72.9060),
      locationAddress: 'Powai Lake, Mumbai',
      targetWasteKg: 150,
      fundGoal: 6000,
      volunteersNeeded: 20,
      volunteersJoined: [],
      fundsCollected: 2000,
      wasteCollected: 0,
      status: 'upcoming',
      photos: [],
    },
  ];

  for (const drive of drives) {
    await db.collection('drives').add(drive);
  }
  console.log(`✅ ${drives.length} drives seeded`);

  // ── Startup Stores ──────────────────────────────────────────────────────────
  const stores = [
    {
      ownerId: 'seed-startup-1',
      name: 'RecycleX',
      description: 'Premium recycled plastic products for everyday use',
      categories: ['Plastic', 'Packaging', 'Consumer Goods'],
      location: new GeoPoint(19.076, 72.8777),
      locationAddress: 'Andheri, Mumbai',
      subscriptionTier: 'pro',
      subscriptionExpiry: Timestamp.fromDate(new Date('2026-01-01')),
      verified: true,
    },
    {
      ownerId: 'seed-startup-2',
      name: 'GreenForge',
      description: 'Recycled metal components and industrial parts',
      categories: ['Metal', 'Industrial', 'Construction'],
      location: new GeoPoint(19.033, 73.0297),
      locationAddress: 'Navi Mumbai',
      subscriptionTier: 'basic',
      subscriptionExpiry: Timestamp.fromDate(new Date('2026-01-01')),
      verified: true,
    },
  ];

  for (const store of stores) {
    await db.collection('startupStores').add(store);
  }
  console.log(`✅ ${stores.length} stores seeded`);

  console.log('\n🎉 Seeding complete!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
