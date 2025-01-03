import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { useEffect } from 'react';
// Services
import { firestore } from 'services/firebase';

/**
 * React hook that retrieves a Firestore document and provides the result as a query object.
 * @param docPath - The path to the Firestore document.
 * @param [subscribe=false] - Whether to subscribe to real-time updates on the document.
 * @returns A React Query object containing the document data.
 */
export function useFirestoreDocument(docPath: string, subscribe = false): UseQueryResult {
  const docRef = doc(firestore, docPath);
  const query = useQuery({
    queryKey: ['firestore', 'doc', docPath],
    queryFn: async () => {
      const snapshot = await getDoc(docRef);
      return snapshot.data();
    },
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (subscribe) {
      const unsubscribe = onSnapshot(docRef, () => {
        query.refetch();
      });

      return () => unsubscribe();
    }
  }, [subscribe]);

  return query;
}
