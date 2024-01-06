import { App } from 'antd';
import { useLanguage } from 'hooks/useLanguage';
import { cloneDeep, orderBy, sample, sampleSize, shuffle } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { PUBLIC_URL } from 'utils/constants';

import { useQuery } from '@tanstack/react-query';

import { ConnectionGame, ConnectionGroup, GroupDictEntry, GroupSummary, ItemGroup } from './types';

const emojiColors: StringDictionary = {
  teal: '🟩',
  orange: '🟧',
  purple: '🟪',
};

export function useConnectTrioGame() {
  const [failToCreate, setFailToCreate] = useState(false);
  const [creatingGame, setCreatingGame] = useState(true);
  const [game, setGame] = useState<ConnectionGame | null>(null);

  const query = useQuery<Dictionary<ConnectionGroup>>({
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

  const createNewGame = async () => {
    setCreatingGame(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const result: GroupSummary[] = [];
    const usedGroupIds = [];

    // Get the first 2 groups. They must have at least
    let tries = 0;
    while (result.length < 2 && tries < 200) {
      tries++;
      const selection = sample(itemCount);
      if (selection && selection.total > 1) {
        const selectedGroups = getTwoGroups(selection.itemId, selection.groups);
        if (selectedGroups.length === 2) {
          usedGroupIds.push(...selectedGroups.map((group) => group.groupId));
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
      console.count('tries');

      // Related third group
      const thirdItem = sample(Object.keys(dict));
      if (thirdItem) {
        const selection = itemCount.find((item) => item.itemId === thirdItem && item);

        if (selection && selection.total > 1) {
          const selectedGroups = getTwoGroups(selection.itemId, selection.groups, dict, usedGroupIds);
          if (selectedGroups.length === 2) {
            result.push(selectedGroups[1]);
          }
        }
      }

      // Random third group
      // const selection = sample(itemCount);
      // if (selection) {
      //   const group = sample(selection.groups)!;
      //   const trio = getTrio('0', group.items, false);
      //   if (trio.length === 3 && trio.every((item) => !dict[item])) {
      //     const copy = cloneDeep(group);
      //     copy.items = trio;
      //     result.push(copy);
      //   }
      // }
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
        groupId: group.groupId,
        name: group.name,
        color: colors[index],
        items: group.items,
        count: group.items.length,
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

    if (newGame.items.length !== 9) {
      setFailToCreate(true);
      return;
    }

    setGame(newGame);
    setCreatingGame(false);
  };

  useEffect(() => {
    if (itemCount.length) {
      createNewGame();
    }
  }, [itemCount]); // eslint-disable-line react-hooks/exhaustive-deps

  /***
   * Create a new game
   * Find an item in 2 groups of 4 that only have the item in common
   * Get one group with that item
   * Get the other group but remove that item
   * Get 2 other groups all with unrelated
   */

  return {
    game,
    failToCreate,
    createNewGame,
    ...query,
    isLoading: query.isLoading || creatingGame,
  };
}

function getTwoGroups(
  itemId: string,
  groupSummaries: GroupSummary[],
  dict: BooleanDictionary = {},
  usedGroupIds: string[] = []
) {
  const mainGroup = cloneDeep(sample(groupSummaries)!);
  mainGroup.items = getTrio(
    itemId,
    mainGroup.items.filter((i) => !dict[i]),
    true
  );

  const itemsDict: BooleanDictionary = mainGroup.items.reduce((acc, item) => ({ ...acc, [item]: true }), {
    ...dict,
  });

  const leftOverGroups = shuffle(groupSummaries.filter((group) => group.groupId !== mainGroup.groupId));

  for (let i = 0; i < leftOverGroups.length; i++) {
    const group = leftOverGroups[i];
    if (usedGroupIds.includes(group.groupId)) {
      continue;
    }
    const trio = getTrio(itemId, group.items, false);
    if (trio.length === 3 && trio.every((item) => !itemsDict[item])) {
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
  const [correctGroups, setCorrectGroups] = useState<GroupDictEntry[]>([]);
  const [showResultModal, setShowResultModal] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

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

  const onSubmit = async () => {
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
      setCorrectGroups((s) => [
        ...s,
        {
          groupId: game.itemsDict[selection[0]].groupId,
          name: activeGroup.name,
          items: selection,
          count: 3,
          color: color,
        },
      ]);
      setPreviousSelection([]);
      if (correctGroups.length === 2) {
        setIsComplete(true);
        setOutcome('WIN');
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setShowResultModal(true);
      } else {
        setOutcome('CORRECT');
      }
    } else {
      setPreviousSelection([...selection]);
      setHistory((h) => [...h, attemptStr]);
      message.error(translate('Você errou o trio!', 'You got the trio wrong!'));
      if (hearts === 1) {
        setOutcome('LOSE');
        const otherGroups = Object.values(game.groupsDict).filter(
          (group) => !correctGroups.find((g) => g.name === group.name)
        );

        setCorrectGroups((s) => [
          ...s,
          ...otherGroups.map((group) => ({
            groupId: group.name,
            name: group.name,
            items: group.items,
            count: 3,
            color: group.color,
          })),
        ]);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setShowResultModal(true);
      } else {
        setOutcome('WRONG');
      }
      setHearts(hearts - 1);
    }

    onDeselectAll();
  };

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
