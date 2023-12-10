import { cloneDeep, merge, padStart, random } from 'lodash';
import { useEffect, useState } from 'react';
import { CARDS_PER_DECK, DEFAULT_ENTRY, TOTAL_DECKS } from './constants';
import { FirebaseImageCardLibrary, ImageCardData, ImageCardRelationship } from './types';
import { UseMutateFunction, useMutation, useQuery, useQueryClient } from 'react-query';
import { firestore } from 'services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { App } from 'antd';
import { cleanupData } from './utils';
import { removeDuplicates } from 'utils/helpers';

const getRandomCardNumber = () => padStart(String(random(1, CARDS_PER_DECK)), 2, '0');

const getRandomDeck = () => random(1, TOTAL_DECKS);

const getRandomCardId = () => `td-d${getRandomDeck()}-${getRandomCardNumber()}`;

export function useRandomCard(
  cardData: FirebaseImageCardLibrary,
  setDirty: (value: React.SetStateAction<boolean>) => void
) {
  const [deck, setDeck] = useState(getRandomDeck());
  const [cardNumber, setCardNumber] = useState(getRandomCardNumber());
  const cardId = `td-d${deck}-${cardNumber}`;

  const onRandomCard = () => {
    setDeck(getRandomDeck());
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

export function useRandomCards(
  cardData: ImageCardRelationship,
  setDirty: (value: React.SetStateAction<boolean>) => void
) {
  const [deckA, setDeckA] = useState(getRandomDeck());
  const [cardNumberA, setCardNumberA] = useState(getRandomCardNumber());
  const [deckB, setDeckB] = useState(getRandomDeck());
  const [cardNumberB, setCardNumberB] = useState(getRandomCardNumber());
  const cardAId = `td-d${deckA}-${cardNumberA}`;
  const cardBId = `td-d${deckB}-${cardNumberB}`;
  const [unrelatedCount, setUnrelatedCount] = useState(0);

  const cardA = cardData?.[cardAId] ?? [];
  const cardB = cardData?.[cardBId] ?? [];

  const onRandomCards = () => {
    setUnrelatedCount(0);
    setDeckA(getRandomDeck());
    setCardNumberA(getRandomCardNumber());
    setDeckB(getRandomDeck());
    setCardNumberB(getRandomCardNumber());
  };

  const relate = () => {
    setUnrelatedCount(0);
    cardA.push(cardBId);
    cardData[cardAId] = cardA;
    cardB.push(cardAId);
    cardData[cardBId] = cardB;
    setDirty(true);
    setDeckA(deckB);
    setCardNumberA(cardNumberB);
    setDeckB(getRandomDeck());
    setCardNumberB(getRandomCardNumber());
  };

  const unrelate = () => {
    if (unrelatedCount >= 10) {
      setUnrelatedCount(0);
      onRandomCards();
    } else {
      setUnrelatedCount((ps) => ps + 1);
      setDeckB(getRandomDeck());
      setCardNumberB(getRandomCardNumber());
    }
  };

  useEffect(() => {
    if (cardAId === cardBId) {
      setCardNumberB(getRandomCardNumber());
    }
  }, [cardAId, cardBId]);

  return {
    cardAId,
    cardA,
    cardBId,
    cardB,
    relate,
    unrelate,
    areRelated: cardA.includes(cardBId),
    onRandomCards,
  };
}

export type UseImageCardsRelationshipDataReturnValue = {
  data: ImageCardRelationship;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  hasData: boolean;
  refetch: () => void;
  isSaving: boolean;
  isMutationError: boolean;
  isSaved: boolean;
  save: UseMutateFunction<{}, unknown, ImageCardRelationship, unknown>;
  setDirty: (value: React.SetStateAction<boolean>) => void;
  isDirty: boolean;
};

export function useImageCardsRelationshipData(): UseImageCardsRelationshipDataReturnValue {
  const [isDirty, setDirty] = useState(false);
  const queryKey = ['data/imageCardsRelationships'];
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
      const docRef = doc(firestore, 'data/imageCardsRelationships');
      const querySnapshot = await getDoc(docRef);
      return (querySnapshot.data() ?? {}) as ImageCardRelationship;
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
  } = useMutation<{}, unknown, ImageCardRelationship, unknown>({
    mutationKey: queryKey,
    mutationFn: async () => {
      const docRef = doc(firestore, 'data/imageCardsRelationships');

      await setDoc(docRef, data);
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

export function useRandomGroups(
  cardData: ImageCardRelationship,
  setDirty: (value: React.SetStateAction<boolean>) => void
) {
  const [cardIds, setCardIds] = useState<string[]>([]);
  const [cards, setCards] = useState<string[][]>([]);

  const [selection, setSelection] = useState<string[]>([]);

  const updateCards = (ids?: string[]) => {
    setCards((ids ?? cardIds).map((id) => cardData?.[id] ?? []));
  };

  const onRandomCards = () => {
    setSelection([]);
    const ids: string[] = [];
    while (ids.length < 9) {
      const id = getRandomCardId();
      if (!ids.includes(id)) {
        ids.push(id);
      }
    }
    setCardIds(ids);
    updateCards(ids);
  };

  // On Load get sample of cards
  useEffect(() => {
    if (cardIds.length === 0) {
      onRandomCards();
    }
  }, [cardIds]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSelect = (id: string) => {
    setSelection((ps) => {
      const copy = [...ps];
      const index = copy.indexOf(id);
      if (index > -1) {
        copy.splice(index, 1);
      } else {
        copy.push(id);
      }
      return copy;
    });
  };

  const relate = () => {
    selection.forEach((id) => {
      const card = cardData[id] ?? [];

      card.push(...selection.filter((s) => s !== id));
      cardData[id] = removeDuplicates(card);
    });
    setDirty(true);
    setSelection([]);
    updateCards();
  };

  return {
    cardIds,
    cards,
    selection,
    onSelect,
    relate,
    nextSet: onRandomCards,
  };
}
