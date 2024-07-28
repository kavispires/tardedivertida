import { useLanguage } from 'hooks/useLanguage';
import { useTDBaseUrl } from 'hooks/useTDBaseUrl';
import { print, stringRemoveAccents } from 'utils/helpers';

import { useQuery } from '@tanstack/react-query';

export function useWordList() {
  const { language } = useLanguage();

  const baseUrl = useTDBaseUrl('resources');
  // const library = 'five-letter-words';
  const library = 'words-5-letters';

  // Load challenge
  return useQuery<StringDictionary>({
    queryKey: ['tdr', library, language],
    queryFn: async () => {
      console.count(`Fetching ${library}-${language}...`);

      const response = await fetch(`${baseUrl}/${library}-${language}.json`);
      const jsonResponse = await response.json();
      const responseData = jsonResponse.reduce(
        (acc: StringDictionary, word: string) => {
          acc[stringRemoveAccents(word)] = word;
          return acc;
        },
        { troco: 'troço' }
      );
      print({ [library]: responseData }, 'log');
      return responseData;
    },
    retry: false,
  });
}
