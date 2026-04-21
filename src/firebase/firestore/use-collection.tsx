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
 * Uses a ref to prevent unnecessary state updates and ensures clean unmounting.
 */
export function useCollection<T = any>(
  queryRef: Query<DocumentData> | null | undefined
): UseCollectionResult<T & { id: string; path: string }> {
  const [data, setData] = useState<(T & { id: string; path: string })[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any | null>(null);
  
  // Track current query to avoid stale snapshots
  const currentQueryRef = useRef<string | null>(null);

  useEffect(() => {
    if (!queryRef) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    const queryKey = queryRef.toString();
    if (currentQueryRef.current === queryKey) return;
    currentQueryRef.current = queryKey;

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
      },
      (err) => {
        if (err.code !== 'permission-denied') {
          console.error("Firestore useCollection Error:", err);
        }
        setError(err);
        setIsLoading(false);
      }
    );

    return () => {
      unsubscribe();
      currentQueryRef.current = null;
    };
  }, [queryRef]);

  return { data, isLoading, error };
}