import { App } from 'antd';
import { useLanguage } from 'hooks/useLanguage';
import { cloneDeep, orderBy, sample, sampleSize, shuffle } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { PUBLIC_URL } from 'utils/constants';

import { useQuery } from '@tanstack/react-query';

import { ConnectionGame, ConnectionGroup, GroupSummary, ItemGroup } from './types';

const emojiColors: StringDictionary = {
  teal: '🟩',
  orange: '🟧',
  purple: '🟪',
};

export function useConnectTrioGame() {
  const query = useQuery<Collection<ConnectionGroup>>({
    queryKey: ['connect-items'],
    queryFn: async () => {
      const response = await fetch(`${PUBLIC_URL.RESOURCES}/connect-items.json`);
      return await response.json();
    },
  });

  const itemCount: ItemGroup[] = useMemo(() => {
    const items: Record<string, GroupSummary[]> = {};
    Object.values(query.data ?? {}).forEach((group) => {
      group.items.forEach((item) => {
        if (group.items.length >= 3) {
          if (!items[item]) {
            items[item] = [];
          }
          items[item].push({
            groupId: group.id,
            name: group.name,
            items: group.items.map(String),
            count: group.items.length,
          });
        }
      });
    });
    return orderBy(
      Object.entries(items).map(([itemId, groups]) => ({
        itemId,
        groups,
        total: groups.length,
      })),
      ['total'],
      ['desc']
    );
  }, [query.data]);

  const [game, setGame] = useState<ConnectionGame | null>(null);

  useEffect(() => {
    if (itemCount.length) {
      const result: GroupSummary[] = [];

      // Get the first 2 groups
      let tries = 0;
      while (result.length < 2 && tries < 200) {
        tries++;
        console.count('try');
        const selection = sample(itemCount);
        if (selection && selection.total > 1) {
          const selectedGroups = getTwoGroups(selection.itemId, selection.groups);
          console.log(selectedGroups);
          if (selectedGroups.length === 2) {
            result.push(...selectedGroups);
          }
        }
      }

      // Get 3rd group
      const dict = result.reduce((acc: BooleanDictionary, group) => {
        group.items.forEach((item) => {
          acc[item] = true;
        });
        return acc;
      }, {});

      tries = 0;
      while (result.length < 3 && tries < 200) {
        tries++;

        const selection = sample(itemCount);
        if (selection) {
          const group = sample(selection.groups)!;
          const trio = getTrio('0', group.items, false);
          if (trio.length === 3 && trio.every((item) => !dict[item])) {
            const copy = cloneDeep(group);
            copy.items = trio;
            result.push(copy);
          }
        }
      }

      const newGame: ConnectionGame = {
        id: '',
        itemsDict: {},
        groupsDict: {},
        items: [],
      };

      const colors: StringDictionary = {
        0: 'teal',
        1: 'orange',
        2: 'purple',
      };

      result.forEach((group, index) => {
        newGame.id += '-' + group.groupId.split('-')[1];
        newGame.groupsDict[group.groupId] = {
          name: group.name,
          color: colors[index],
        };

        group.items.forEach((item) => {
          newGame.items.push(item);

          newGame.itemsDict[item] = {
            groupId: group.groupId,
            itemId: item,
            color: colors[index],
          };
        });
      });

      newGame.items = shuffle(newGame.items);

      setGame(newGame);
    }
  }, [itemCount]);

  /***
   * Create a new game
   * Find an item in 2 groups of 4 that only have the item in common
   * Get one group with that item
   * Get the other group but remove that item
   * Get 2 other groups all with unrelated
   */

  return {
    game,
    ...query,
  };
}

function getTwoGroups(itemId: string, groupSummaries: GroupSummary[]) {
  const mainGroup = cloneDeep(sample(groupSummaries)!);
  mainGroup.items = getTrio(itemId, mainGroup.items, true);

  const dict: BooleanDictionary = mainGroup.items.reduce((acc, item) => ({ ...acc, [item]: true }), {});

  const leftOverGroups = shuffle(groupSummaries.filter((group) => group.groupId !== mainGroup.groupId));

  for (let i = 0; i < leftOverGroups.length; i++) {
    const group = leftOverGroups[i];
    const trio = getTrio(itemId, group.items, false);
    if (trio.length === 3 && trio.every((item) => !dict[item])) {
      const copy = cloneDeep(group);
      copy.items = trio;
      return [mainGroup, copy];
    }
  }

  return [];
}

function getTrio(itemId: string, items: string[], includeItem: boolean) {
  const selectedItems = items.filter((item) => item !== itemId);

  if (includeItem) {
    return [itemId, ...sampleSize(selectedItems, 2)].sort();
  }

  return sampleSize(selectedItems, 3).sort();
}

export function useConnectTrioEngine(game: ConnectionGame) {
  const { message } = App.useApp();
  const { translate } = useLanguage();

  const [hearts, setHearts] = useState<number>(3);
  const [items, setItems] = useState<string[]>(game.items);
  const [frozenItems, setFrozenItems] = useState<string[]>([]);
  const [selection, setSelection] = useState<string[]>([]);
  const [previousSelection, setPreviousSelection] = useState<string[]>([]);
  const [resultPrint, setResultPrint] = useState<string>('');
  const [outcome, setOutcome] = useState<string>('CONTINUE');
  const [history, setHistory] = useState<string[]>([]);
  const [correctGroups, setCorrectGroups] = useState<GroupSummary[]>([]);
  const [showResultModal, setShowResultModal] = useState(false);

  const onShuffle = () => {
    setItems(shuffle(items.filter((item) => !frozenItems.includes(item))));
  };

  const onSelect = (itemId: string) => {
    if (selection.includes(itemId)) {
      setSelection(selection.filter((item) => item !== itemId));
      return;
    }

    if (selection.length === 3) {
      message.info(translate('Você só pode selecionar 3 itens', 'You can only select 3 items'));
      return;
    }

    setSelection([...selection, itemId]);
  };

  const onDeselectAll = () => {
    setSelection([]);
  };

  const onSubmit = () => {
    const attemptStr = selection.sort().join('-');
    if (history.includes(attemptStr)) {
      message.info(translate('Você já tentou esse trio', 'You already tried this trio'));
      return;
    }

    const color = game.itemsDict[selection[0]].color;
    const activeGroup = game.groupsDict[game.itemsDict[selection[0]].groupId];
    let isCorrect = true;
    let print = '';
    selection.forEach((itemId) => {
      if (game.itemsDict[itemId].color !== color) {
        isCorrect = false;
      }
      print += emojiColors[game.itemsDict[itemId].color];
      print += ' ';
    });
    print += '\n';

    setResultPrint((v) => v + print);

    if (isCorrect) {
      message.success(translate('Você acertou um trio!', 'You got the trio right!'));
      setFrozenItems([...frozenItems, ...selection]);
      setItems(items.filter((item) => !selection.includes(item)));
      if (correctGroups.length === 2) {
        setShowResultModal(true);
        setOutcome('WIN');
      } else {
        setOutcome('CORRECT');
      }
      setCorrectGroups((s) => [
        ...s,
        {
          groupId: game.itemsDict[selection[0]].groupId,
          name: activeGroup.name,
          items: selection,
          count: 3,
        },
      ]);
      setPreviousSelection([]);
    } else {
      setPreviousSelection([...selection]);
      setHistory((h) => [...h, attemptStr]);
      message.error(translate('Você errou o trio!', 'You got the trio wrong!'));
      if (hearts === 1) {
        setShowResultModal(true);
        setOutcome('LOSE');
      } else {
        setOutcome('WRONG');
      }
      setHearts(hearts - 1);
    }

    onDeselectAll();
  };

  const isComplete = correctGroups.length === 3;
  const disabled = hearts === 0 || isComplete;

  return {
    hearts,
    items,
    selection,
    previousSelection,
    onShuffle,
    onSelect,
    onSubmit,
    onDeselectAll,
    outcome,
    resultPrint,
    correctGroups,
    isComplete,
    showResultModal,
    setShowResultModal,
    disabled,
  };
}
