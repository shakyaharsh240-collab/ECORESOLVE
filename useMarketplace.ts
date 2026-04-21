/**
 * EcoResolve — Marketplace Hooks
 */

import { useEffect, useState } from 'react';
import {
  subscribeToWasteListings,
  subscribeToStores,
  subscribeToStoreProducts,
  subscribeToUserOrders,
  createOrder,
} from '../services/marketplace.service';
import { WasteListing, StartupStore, Product, Order, WasteType } from '../constants/types';

export function useWasteListings(typeFilter?: WasteType) {
  const [listings, setListings] = useState<WasteListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsub = subscribeToWasteListings((data) => {
      setListings(data);
      setLoading(false);
    }, { type: typeFilter, status: 'available' });
    return unsub;
  }, [typeFilter]);

  return { listings, loading };
}

export function useStores() {
  const [stores, setStores] = useState<StartupStore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToStores((data) => {
      setStores(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  return { stores, loading };
}

export function useStoreProducts(storeId: string | null) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!storeId) { setLoading(false); return; }
    const unsub = subscribeToStoreProducts(storeId, (data) => {
      setProducts(data);
      setLoading(false);
    });
    return unsub;
  }, [storeId]);

  return { products, loading };
}

export function useUserOrders(userId: string | null) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    const unsub = subscribeToUserOrders(userId, (data) => {
      setOrders(data);
      setLoading(false);
    });
    return unsub;
  }, [userId]);

  return { orders, loading };
}
