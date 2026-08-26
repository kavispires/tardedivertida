import { LRUCache } from 'lru-cache';
// Internal
import { throwHttpsError } from './firebase-core';

type FetchResourceOptions = {
  /**
   * Whether to cache the fetched resource for subsequent requests
   */
  cache?: boolean;
  /**
   * Optional language code for localized resources
   */
  language?: string;
};

// Use an LRU cache to prevent memory leaks across serverless invocations
const resourceCache = new LRUCache<string, object>({
  max: 5, // Maximum number of items to keep in memory
  ttl: 1000 * 60 * 10, // 10 minutes Time-To-Live ensures data eventually refreshes
});

const inFlightRequests = new Map<string, Promise<unknown>>();

/**
 * Queries a TDR resource file
 * @param resourceName - The name of the resource to fetch
 * @param language - Optional language code for localized resources
 * @param options - Optional resource fetching options
 */
export const fetchResource = async <T>(resourceName: string, options?: FetchResourceOptions): Promise<T> => {
  const resourceUrl = `${process.env.TD_RESOURCES}${resourceName}${options?.language ? `-${options.language}` : ''}.json`;
  const shouldCache = options?.cache === true;

  if (shouldCache && resourceCache.has(resourceUrl)) {
    // Return a clone to prevent callers from mutating the cached object
    return structuredClone(resourceCache.get(resourceUrl)) as T;
  }

  let request = inFlightRequests.get(resourceUrl);

  if (!request) {
    request = fetch(resourceUrl)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        if (shouldCache) {
          // Cache a clone so the cache itself remains immutable
          resourceCache.set(resourceUrl, structuredClone(data));
        }
        return data;
      })
      .catch((e) => {
        throw throwHttpsError(`${e}`, `Failed to get resource for ${resourceName}`);
      })
      .finally(() => {
        // Remove the request from the map once resolved or rejected
        inFlightRequests.delete(resourceUrl);
      });

    inFlightRequests.set(resourceUrl, request);
  }

  // Ensure every concurrent caller awaits the same network request
  // but receives their own isolated clone of the data
  const data = await request;
  return shouldCache ? (structuredClone(data) as T) : (data as T);
};
