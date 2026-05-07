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
 * Robust real-time collection hook with internal state protection.
 * Prevents "INTERNAL ASSERTION FAILED" by strictly managing listener lifecycle.
 */
export function useCollection<T = any>(
  queryRef: Query<DocumentData> | null | undefined
): UseCollectionResult<T & { id: string; path: string }> {
  const [data, setData] = useState<(T & { id: string; path: string })[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(!!queryRef);
  const [error, setError] = useState<FirestoreError | null>(null);
  
  // Guard against updates on unmounted components
  const isMounted = useRef(true);
  // Prevent redundant listeners if the query identity hasn't truly changed
  const lastQueryKey = useRef<string | null>(null);

  useEffect(() => {
    isMounted.current = true;
    
    if (!queryRef) {
      setData(null);
      setIsLoading(false);
      setError(null);
      lastQueryKey.current = null;
      return;
    }

    const currentKey = queryRef.toString();
    if (lastQueryKey.current === currentKey) return;
    lastQueryKey.current = currentKey;

    setIsLoading(true);

    const unsubscribe = onSnapshot(
      queryRef,
      (snapshot: QuerySnapshot<DocumentData>) => {
        if (!isMounted.current) return;
        
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
        if (!isMounted.current) return;
        
        // Suppress common expected errors from console to prevent clutter
        if (err.code !== 'permission-denied' && !err.message.includes('requires an index')) {
          console.warn("Firestore Listener Error:", err.message);
        }
        
        setError(err);
        setIsLoading(false);
        setData(null);
      }
    );

    return () => {
      isMounted.current = false;
      unsubscribe();
    };
  }, [queryRef]);

  return { data, isLoading, error };
}
