'use client';

import { useState, useEffect, useRef } from 'react';
import {
  onSnapshot,
  DocumentData,
  QuerySnapshot,
  Query,
  FirestoreError,
} from 'firebase/firestore';

export interface UseCollectionResult<T> {
  data: T[] | null;
  isLoading: boolean;
  error: FirestoreError | null;
}

/**
 * Robust real-time collection hook.
 * Monitors Firestore queries and provides data, loading, and error states.
 */
export function useCollection<T = any>(
  queryRef: Query<DocumentData> | null | undefined
): UseCollectionResult<T & { id: string; path: string }> {
  const [data, setData] = useState<(T & { id: string; path: string })[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(!!queryRef);
  const [error, setError] = useState<FirestoreError | null>(null);
  
  // Track the current active subscription to prevent race conditions
  const activeQuery = useRef<Query<DocumentData> | null>(null);

  useEffect(() => {
    // If no query is provided (e.g. user not loaded), reset state
    if (!queryRef) {
      setData(null);
      setIsLoading(false);
      setError(null);
      activeQuery.current = null;
      return;
    }

    // Prevent redundant subscriptions if the query object is identical
    if (activeQuery.current === queryRef) return;
    activeQuery.current = queryRef;

    setIsLoading(true);

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
      (err: FirestoreError) => {
        // Log errors except for standard index ones which are handled by the UI
        if (!err.message.includes('requires an index')) {
          console.error("Firestore Collection Error:", err);
        }
        
        setError(err);
        setIsLoading(false);
        setData(null);
      }
    );

    return () => {
      unsubscribe();
      activeQuery.current = null;
    };
  }, [queryRef]);

  return { data, isLoading, error };
}
