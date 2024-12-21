import { shuffle } from 'lodash';
import { useMemo, useState } from 'react';
// Internal
import type { DrawingEntry } from './types';

const checkIsSubject = (cardId: string) => cardId.includes('wss');
const checkIsDescriptor = (cardId: string) => cardId.includes('wsd');
const checkType = (cardId: string) => {
  if (!cardId) {
    return 'none';
  }
  if (checkIsSubject(cardId)) {
    return 'subject';
  }
  if (checkIsDescriptor(cardId)) {
    return 'descriptor';
  }
  return 'drawing';
};

export function useGuessing({
  drawings,
  userId,
  subjectsIds,
  descriptorsIds,
}: {
  drawings: DrawingEntry[];
  userId: PlayerId;
  subjectsIds: CardId[];
  descriptorsIds: CardId[];
}) {
  const getDefaultSubjects = () => {
    return drawings.reduce((acc: StringDictionary, { playerId, subjectId }) => {
      acc[playerId] = '';
      if (playerId === userId) {
        acc[playerId] = subjectId;
      }
      return acc;
    }, {});
  };

  const getDefaultDescriptors = () => {
    return drawings.reduce((acc: StringDictionary, { playerId, descriptorId }) => {
      acc[playerId] = '';
      if (playerId === userId) {
        acc[playerId] = descriptorId;
      }
      return acc;
    }, {});
  };

  const [activeItem, setActiveItem] = useState('');
  const [subjectGuesses, setSubjectGuesses] = useState<StringDictionary>(getDefaultSubjects());
  const [descriptorGuesses, setDescriptorGuesses] = useState<StringDictionary>(getDefaultDescriptors());

  const activateItem = (entryId: string) => {
    // If same select, deselect
    if (entryId === activeItem) {
      return setActiveItem('');
    }

    const activeType = checkType(activeItem);
    const entryType = checkType(entryId);

    // If same type, replace
    if (activeType === entryType) {
      return setActiveItem(entryId);
    }

    // If any type is a drawing, match
    if (entryId && (activeType === 'drawing' || entryType === 'drawing')) {
      if (entryType === 'subject') {
        setActiveItem('');
        return setSubjectGuesses((prev) => ({ ...prev, [activeItem]: entryId }));
      }
      if (entryType === 'descriptor') {
        setActiveItem('');
        return setDescriptorGuesses((prev) => ({ ...prev, [activeItem]: entryId }));
      }
      if (activeType === 'subject') {
        setActiveItem('');
        return setSubjectGuesses((prev) => ({ ...prev, [entryId]: activeItem }));
      }
      if (activeType === 'descriptor') {
        setActiveItem('');
        return setDescriptorGuesses((prev) => ({ ...prev, [entryId]: activeItem }));
      }
    }

    setActiveItem(entryId);
  };

  const resetGuesses = () => {
    setActiveItem('');
    setSubjectGuesses(getDefaultSubjects());
    setDescriptorGuesses(getDefaultDescriptors());
  };

  const matchedItems = useMemo(() => {
    const result: BooleanDictionary = {};
    Object.values(subjectGuesses).forEach((cardId) => {
      if (cardId) {
        result[cardId] = true;
      }
    });
    Object.values(descriptorGuesses).forEach((cardId) => {
      if (cardId) {
        result[cardId] = true;
      }
    });
    return result;
  }, [subjectGuesses, descriptorGuesses]);

  const isComplete = useMemo(() => {
    return Object.values(subjectGuesses).every(Boolean) && Object.values(descriptorGuesses).every(Boolean);
  }, [subjectGuesses, descriptorGuesses]);

  const randomSelection = () => {
    const usedSubjects = Object.values(subjectGuesses);
    const availableSubjects = shuffle(subjectsIds.filter((id) => !usedSubjects.includes(id)));
    const subjectVotes: StringDictionary = {};
    Object.keys(subjectGuesses).forEach((playerId) => {
      if (!subjectGuesses[playerId]) {
        subjectVotes[playerId] = availableSubjects.pop() ?? '';
      }
    });

    const usedDescriptors = Object.values(descriptorGuesses);
    const availableDescriptors = shuffle(descriptorsIds.filter((id) => !usedDescriptors.includes(id)));
    const descriptorVotes: StringDictionary = {};
    Object.keys(descriptorGuesses).forEach((playerId) => {
      if (!descriptorGuesses[playerId]) {
        descriptorVotes[playerId] = availableDescriptors.pop() ?? '';
      }
    });

    setSubjectGuesses((prev) => ({ ...prev, ...subjectVotes }));
    setDescriptorGuesses((prev) => ({ ...prev, ...descriptorVotes }));
  };

  return {
    activeItem,
    activateItem,
    subjectGuesses,
    descriptorGuesses,
    matchedItems,
    isComplete,
    resetGuesses,
    randomSelection,
  };
}
