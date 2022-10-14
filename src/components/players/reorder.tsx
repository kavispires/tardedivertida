export function reorder(order: PlayerId[], startWith: PlayerId): PlayerId[] {
  const starterIndex = order.indexOf(startWith);

  return [...order.slice(starterIndex), ...order.slice(0, starterIndex)];
}
