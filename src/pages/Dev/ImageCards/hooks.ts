import { cloneDeep, merge, padStart, random } from 'lodash';
import { useEffect, useState } from 'react';
import { CARDS_PER_DECK, DEFAULT_ENTRY, TOTAL_DECKS } from './constants';
import { FirebaseImageCardLibrary, ImageCardData } from './types';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { firestore } from 'services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { App } from 'antd';
import { cleanupData } from './utils';

const getRandomCardNumber = () => padStart(String(random(1, CARDS_PER_DECK)), 2, '0');

export function useRandomCard(
  cardData: FirebaseImageCardLibrary,
  setDirty: (value: React.SetStateAction<boolean>) => void
) {
  const [deck, setDeck] = useState(random(1, TOTAL_DECKS));
  const [cardNumber, setCardNumber] = useState(getRandomCardNumber());
  const cardId = `td-d${deck}-${cardNumber}`;

  const onRandomCard = () => {
    setDeck(random(1, TOTAL_DECKS));
    setCardNumber(getRandomCardNumber());
  };

  const card = merge(cloneDeep(DEFAULT_ENTRY), cardData?.[cardId] ?? {});

  const add = (key: keyof ImageCardData, value: string) => {
    if (key !== 'highlight' && card[key]) {
      card[key]!.push(value);
      setDirty(true);
    }
  };

  const remove = (key: keyof ImageCardData, value: string) => {
    if (key !== 'highlight' && card[key]) {
      const entry = card[key] ?? [];
      entry.splice(entry.indexOf(value), 1);
      setDirty(true);
    }
  };

  const update = (key: keyof ImageCardData, value: string[]) => {
    if (key !== 'highlight') {
      card[key] = value.map((v) => v.trim().toLowerCase());
      setDirty(true);
    }
  };

  const toggleHighlight = () => {
    card.highlight = !card.highlight;
    setDirty(true);
  };

  useEffect(() => {
    cardData[cardId] = card;
  }, [card]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    cardId,
    deck,
    onRandomCard,
    card,
    add,
    remove,
    update,
    toggleHighlight,
  };
}

export function useImageCardsData() {
  const [isDirty, setDirty] = useState(false);
  const queryKey = ['data/imageCards'];
  const queryClient = useQueryClient();
  const { notification } = App.useApp();

  const {
    data = {},
    isLoading,
    isSuccess,
    isError,
    refetch,
  } = useQuery<any>({
    queryKey,
    queryFn: async () => {
      const docRef = doc(firestore, 'data/imageCards');
      const querySnapshot = await getDoc(docRef);
      return (querySnapshot.data() ?? {}) as FirebaseImageCardLibrary;
    },
    onSuccess: () => {
      notification.info({
        message: 'Data loaded',
        placement: 'bottomLeft',
      });
      setDirty(false);
    },
    onError: () => {
      notification.error({
        message: 'Error loading data',
        placement: 'bottomLeft',
      });
    },
  });

  const {
    isLoading: isSaving,
    isError: isMutationError,
    isSuccess: isSaved,
    mutate: save,
  } = useMutation<{}, unknown, FirebaseImageCardLibrary, unknown>({
    mutationKey: queryKey,
    mutationFn: async () => {
      const docRef = doc(firestore, 'data/imageCards');
      const cleanData = cleanupData(data);
      await setDoc(docRef, cleanData);
      return data;
    },
    onSuccess: () => {
      notification.success({
        message: 'Saved',
        placement: 'bottomLeft',
      });
      queryClient.refetchQueries(queryKey);
      setDirty(false);
    },
  });

  return {
    data,
    isLoading,
    isSuccess,
    isError,
    hasData: isSuccess && Object.keys(data).length > 0,
    refetch,
    isSaving,
    isMutationError,
    isSaved,
    save,
    setDirty,
    isDirty,
  };
}
