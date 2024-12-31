import { useQuery } from '@tanstack/react-query';
// Types
import type { ItemAttribute } from 'types/tdr';
// Hooks
import { useTDBaseUrl } from 'hooks/useTDBaseUrl';

export function useAlienAttributes(enabled: boolean) {
  const baseUrl = useTDBaseUrl('resources');
  return useQuery<Dictionary<ItemAttribute>, ResponseError>({
    queryKey: ['items-attributes'],
    queryFn: async () => {
      const response = await fetch(`${baseUrl}/items-attributes.json`);
      return await response.json();
    },
    enabled,
    staleTime: Number.POSITIVE_INFINITY,
  });
}
