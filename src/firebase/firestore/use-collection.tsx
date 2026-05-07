'use client';

import { useState, useEffect, useRef } from 'react';
import {
  onSnapshot,
  DocumentData,
  QuerySnapshot,
  Query,
} from 'firebase/firestore';

export interface UseCollectionResult<T> {
  data: T[] | null;
  isLoading: boolean;
  error: any | null;
}

/**
 * Optimized real-time collection hook.
 * Uses a ref and stringified key to prevent unnecessary state updates and internal assertion errors.
 */
export function useCollection<T = any>(
  queryRef: Query<DocumentData> | null | undefined
): UseCollectionResult<T & { id: string; path: string }> {
  const [data, setData] = useState<(T & { id: string; path: string })[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any | null>(null);
  
  // Track current query to avoid stale snapshots or redundant listeners
  const currentQueryKey = useRef<string | null>(null);

  useEffect(() => {
    if (!queryRef) {
      setData(null);
      setIsLoading(false);
      setError(null);
      currentQueryKey.current = null;
      return;
    }

    // Using query string representation to avoid unnecessary re-subscriptions on reference changes
    const queryKey = queryRef.toString();
    if (currentQueryKey.current === queryKey) return;
    currentQueryKey.current = queryKey;

    setIsLoading(true);
    setError(null);

    const unsubscribe = onSnapshot(
      queryRef,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const results = snapshot.docs.map(doc => ({
          ...(doc.data() as T),
          id: doc.id,
          path: doc.ref.path
        }));
        
        setData(results);
        setIsLoading(false);
        setError(null);
      },
      (err) => {
        // Standardize error reporting
        if (err.code !== 'permission-denied' && !err.message?.includes('requires an index')) {
          console.error("Firestore useCollection Error:", err);
        }
        setError(err);
        setIsLoading(false);
        setData(null);
      }
    );

    return () => {
      unsubscribe();
      currentQueryKey.current = null;
    };
  }, [queryRef]); // Dependencies must be memoized by the caller

  return { data, isLoading, error };
}