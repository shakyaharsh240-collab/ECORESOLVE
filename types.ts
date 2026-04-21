/**
 * EcoResolve — Core TypeScript Types
 */

// ── User & Auth ───────────────────────────────────────────────────────────────

export type UserRole = 'volunteer' | 'organizer' | 'startup';

export interface User {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  photoURL?: string;
  coverURL?: string;
  roles: UserRole[];
  activeRole: UserRole;
  tokens: number;        // escrow (locked)
  releasedTokens: number;
  rank: number;
  badges: string[];
  createdAt: Date;
}

// ── Drives ────────────────────────────────────────────────────────────────────

export type DriveStatus = 'upcoming' | 'active' | 'completed' | 'cancelled';

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface Drive {
  id: string;
  organizerId: string;
  organizerName?: string;
  organizerPhoto?: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: GeoPoint;
  locationAddress?: string;
  targetWasteKg: number;
  fundGoal: number;
  volunteersNeeded: number;
  volunteersJoined: string[];
  fundsCollected: number;
  wasteCollected: number;
  status: DriveStatus;
  photos: string[];
  distanceKm?: number;
}

// ── Waste Listings ────────────────────────────────────────────────────────────

export type WasteType = 'plastic' | 'paper' | 'metal' | 'glass' | 'ewaste' | 'organic';
export type WasteCondition = 'clean' | 'mixed' | 'contaminated';
export type ListingStatus = 'available' | 'sold' | 'pending';

export interface WasteListing {
  id: string;
  organizerId: string;
  driveId: string;
  type: WasteType;
  quantity: number; // kg
  condition: WasteCondition;
  price: number;
  photos: string[];
  location: GeoPoint;
  locationAddress?: string;
  status: ListingStatus;
  contributingVolunteers: Record<string, number>; // uid → tokenShare
  createdAt: Date;
}

// ── Startup Stores ────────────────────────────────────────────────────────────

export type SubscriptionTier = 'basic' | 'pro' | 'enterprise';

export interface StartupStore {
  id: string;
  ownerId: string;
  name: string;
  logo?: string;
  description: string;
  categories: string[];
  location: GeoPoint;
  locationAddress?: string;
  subscriptionTier: SubscriptionTier;
  subscriptionExpiry: Date;
  verified: boolean;
}

// ── Products ──────────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  storeId: string;
  name: string;
  description: string;
  price: number;
  inventory: number;
  photos: string[];
  category: string;
  isBestseller: boolean;
  tags: string[];
}

// ── Orders ────────────────────────────────────────────────────────────────────

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  buyerId: string;
  sellerId: string;
  listingId: string;
  amount: number;
  status: OrderStatus;
  paymentIntentId?: string;
  createdAt: Date;
}

// ── Proof Photos ──────────────────────────────────────────────────────────────

export interface ProofPhoto {
  id: string;
  volunteerId: string;
  driveId: string;
  photoURL: string;
  aiVerified: boolean;
  duplicateScore: number;
  fakeScore: number;
  wasteCategory?: WasteType;
  quantityEstimate?: number;
  uploadedAt: Date;
}

// ── Notifications ─────────────────────────────────────────────────────────────

export type NotificationType =
  | 'drive_reminder'
  | 'token_released'
  | 'purchase_alert'
  | 'proof_verified'
  | 'drive_joined'
  | 'waste_sold'
  | 'badge_earned';

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  message: string;
  relatedId?: string;
  read: boolean;
  createdAt: Date;
}

// ── Navigation ────────────────────────────────────────────────────────────────

export type RootStackParamList = {
  '(auth)/welcome': undefined;
  '(auth)/login': undefined;
  '(auth)/signup': undefined;
  '(auth)/otp': { phone: string };
  '(auth)/role-select': undefined;
  '(tabs)': undefined;
  'drives/[id]': { id: string };
  'drives/create': undefined;
  'marketplace/listing/[id]': { id: string };
  'marketplace/store/[id]': { id: string };
  'marketplace/waste/[id]': { id: string };
};
