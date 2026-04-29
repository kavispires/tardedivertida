/**
 * Reorders a list of UIDs to start with a specific UID
 */
export function reorder(order: UID[], startWith: UID): UID[] {
  const starterIndex = order.indexOf(startWith);

  return [...order.slice(starterIndex), ...order.slice(0, starterIndex)];
}
