import { App } from 'antd';
import { useLanguage } from 'hooks/useLanguage';
import { useTDBaseUrl } from 'hooks/useTDBaseUrl';
import { print } from 'utils/helpers';

import { useQuery } from '@tanstack/react-query';

export function useWordList() {
  const { language } = useLanguage();
  const { notification } = App.useApp();
  const baseUrl = useTDBaseUrl('tdr');
  const library = 'five-letter-words';

  // Load challenge
  return useQuery<string[]>({
    queryKey: ['tdr', library, language],
    queryFn: async () => {
      console.count(`Fetching ${library}-${language}...`);

      const response = await fetch(`${baseUrl}/${library}-${language}.json`);
      return await response.json();
    },
    retry: false,
    onSuccess: (response) => {
      const data = response;
      print({ [library]: data }, 'table');
    },
    onError: (e: any) => {
      notification.error({
        message: 'Failed to load user',
        description: JSON.stringify(e.message),
      });
    },
  });
}
