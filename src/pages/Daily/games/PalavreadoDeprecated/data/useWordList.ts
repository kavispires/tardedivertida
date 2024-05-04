import { App } from 'antd';
import { useLanguage } from 'hooks/useLanguage';
import { useTDBaseUrl } from 'hooks/useTDBaseUrl';
import { print, stringRemoveAccents } from 'utils/helpers';

import { useQuery } from '@tanstack/react-query';

export function useWordList() {
  const { language } = useLanguage();
  const { notification } = App.useApp();
  const baseUrl = useTDBaseUrl('tdr');
  // const library = 'five-letter-words';
  const library = 'words-5-letters';

  // Load challenge
  return useQuery<StringDictionary>({
    queryKey: ['tdr', library, language],
    queryFn: async () => {
      console.count(`Fetching ${library}-${language}...`);

      const response = await fetch(`${baseUrl}/${library}-${language}.json`);
      const jsonResponse = await response.json();
      return jsonResponse.reduce(
        (acc: StringDictionary, word: string) => {
          acc[stringRemoveAccents(word)] = word;
          return acc;
        },
        { troco: 'troço' }
      );
    },
    retry: false,
    onSuccess: (response) => {
      const data = response;
      print({ [library]: data }, 'log');
    },
    onError: (e: any) => {
      notification.error({
        message: 'Failed to load user',
        description: JSON.stringify(e.message),
      });
    },
  });
}
