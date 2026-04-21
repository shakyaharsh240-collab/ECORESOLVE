/**
 * EcoResolve — Marketplace Firestore Service
 * Waste listings · Startup stores · Products · Orders
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Unsubscribe,
  GeoPoint as FirestoreGeoPoint,
} from 'firebase/firestore';
import { db } from './firebase';
import {
  WasteListing,
  WasteType,
  WasteCondition,
  ListingStatus,
  StartupStore,
  Product,
  Order,
  GeoPoint,
} from '../constants/types';

// ── Waste Listings ────────────────────────────────────────────────────────────

function docToListing(id: string, data: any): WasteListing {
  return {
    id,
    organizerId: data.organizerId,
    driveId: data.driveId,
    type: data.type,
    quantity: data.quantity ?? 0,
    condition: data.condition,
    price: data.price ?? 0,
    photos: data.photos ?? [],
    location: {
      latitude: data.location?.latitude ?? 0,
      longitude: data.location?.longitude ?? 0,
    },
    locationAddress: data.locationAddress,
    status: data.status ?? 'available',
    contributingVolunteers: data.contributingVolunteers ?? {},
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
  };
}

export function subscribeToWasteListings(
  callback: (listings: WasteListing[]) => void,
  filters?: { type?: WasteType; status?: ListingStatus }
): Unsubscribe {
  let q = query(
    collection(db, 'wasteListings'),
    where('status', '==', filters?.status ?? 'available'),
    orderBy('createdAt', 'desc'),
    limit(30)
  );

  return onSnapshot(q, (snap) => {
    let listings = snap.docs.map((d) => docToListing(d.id, d.data()));
    if (filters?.type) {
      listings = listings.filter((l) => l.type === filters.type);
    }
    callback(listings);
  });
}

export async function getWasteListing(id: string): Promise<WasteListing | null> {
  const snap = await getDoc(doc(db, 'wasteListings', id));
  if (!snap.exists()) return null;
  return docToListing(snap.id, snap.data());
}

export interface CreateListingInput {
  organizerId: string;
  driveId: string;
  type: WasteType;
  quantity: number;
  condition: WasteCondition;
  price: number;
  photos: string[];
  location: GeoPoint;
  locationAddress: string;
  contributingVolunteers: Record<string, number>;
}

export async function createWasteListing(input: CreateListingInput): Promise<string> {
  const ref = await addDoc(collection(db, 'wasteListings'), {
    ...input,
    location: new FirestoreGeoPoint(input.location.latitude, input.location.longitude),
    status: 'available',
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateListingStatus(
  listingId: string,
  status: ListingStatus
): Promise<void> {
  await updateDoc(doc(db, 'wasteListings', listingId), { status });
}

// ── Startup Stores ────────────────────────────────────────────────────────────

function docToStore(id: string, data: any): StartupStore {
  return {
    id,
    ownerId: data.ownerId,
    name: data.name,
    logo: data.logo,
    description: data.description,
    categories: data.categories ?? [],
    location: {
      latitude: data.location?.latitude ?? 0,
      longitude: data.location?.longitude ?? 0,
    },
    locationAddress: data.locationAddress,
    subscriptionTier: data.subscriptionTier ?? 'basic',
    subscriptionExpiry: data.subscriptionExpiry?.toDate
      ? data.subscriptionExpiry.toDate()
      : new Date(),
    verified: data.verified ?? false,
  };
}

export function subscribeToStores(
  callback: (stores: StartupStore[]) => void
): Unsubscribe {
  const q = query(
    collection(db, 'startupStores'),
    where('verified', '==', true),
    orderBy('name', 'asc'),
    limit(20)
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => docToStore(d.id, d.data())));
  });
}

export async function getStore(storeId: string): Promise<StartupStore | null> {
  const snap = await getDoc(doc(db, 'startupStores', storeId));
  if (!snap.exists()) return null;
  return docToStore(snap.id, snap.data());
}

// ── Products ──────────────────────────────────────────────────────────────────

function docToProduct(id: string, data: any): Product {
  return {
    id,
    storeId: data.storeId,
    name: data.name,
    description: data.description,
    price: data.price ?? 0,
    inventory: data.inventory ?? 0,
    photos: data.photos ?? [],
    category: data.category,
    isBestseller: data.isBestseller ?? false,
    tags: data.tags ?? [],
  };
}

export function subscribeToStoreProducts(
  storeId: string,
  callback: (products: Product[]) => void
): Unsubscribe {
  const q = query(
    collection(db, 'products'),
    where('storeId', '==', storeId),
    orderBy('name', 'asc')
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => docToProduct(d.id, d.data())));
  });
}

// ── Orders ────────────────────────────────────────────────────────────────────

function docToOrder(id: string, data: any): Order {
  return {
    id,
    buyerId: data.buyerId,
    sellerId: data.sellerId,
    listingId: data.listingId,
    amount: data.amount ?? 0,
    status: data.status ?? 'pending',
    paymentIntentId: data.paymentIntentId,
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
  };
}

export async function createOrder(
  input: Omit<Order, 'id' | 'createdAt'>
): Promise<string> {
  const ref = await addDoc(collection(db, 'orders'), {
    ...input,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export function subscribeToUserOrders(
  userId: string,
  callback: (orders: Order[]) => void
): Unsubscribe {
  const q = query(
    collection(db, 'orders'),
    where('buyerId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(20)
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => docToOrder(d.id, d.data())));
  });
}
