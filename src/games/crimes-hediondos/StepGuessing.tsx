import { useState } from 'react';
// Ant Design Resources
import { Button } from 'antd';
// Hooks
import { useMock } from 'hooks';
// Utils
import { getAvatarColorById, getLastItem, isDevEnv } from 'utils/helpers';
import { mockGuesses } from './mock';
import { getHistory } from './helpers';
// Components
import {
  ButtonContainer,
  FloatingHand,
  Instruction,
  ReadyPlayersBar,
  Step,
  Title,
  Translate,
} from 'components';
import { Crime } from './Crime';
import { PlayersCards } from './PlayersCards';
import { SelectableGroupedItemsBoard } from './SelectableGroupedItemsBoard';

type StepGuessingProps = {
  user: GamePlayer;
  players: GamePlayers;
  items: ItemsDict;
  groupedItems: GroupedItems;
  scenes: ScenesDict;
  scenesOrder: string[];
  crimes: Crime[];
  onSubmitGuesses: GenericFunction;
};

export function StepGuessing({
  user,
  groupedItems,
  items,
  players,
  scenes,
  scenesOrder,
  crimes,
  onSubmitGuesses,
}: StepGuessingProps) {
  const [guesses, setGuesses] = useState<PlainObject>({});
  const [activePlayerId, setActivePlayerId] = useState<PlayerId>('');

  const onUpdateGuesses = (itemId: string) => {
    if (activePlayerId && itemId) {
      const guessObj = {
        ...(guesses[activePlayerId] ?? {
          weaponId: undefined,
          evidenceId: undefined,
          isComplete: false,
        }),
      };

      const isWeapon = itemId.includes('wp');

      if (isWeapon) {
        guessObj.weaponId = itemId;
      } else {
        guessObj.evidenceId = itemId;
      }

      setGuesses((s: PlainObject) => ({
        ...s,
        [activePlayerId]: {
          ...guessObj,
          isComplete: Boolean(guessObj?.weaponId && guessObj?.evidenceId),
        },
      }));
    }
  };

  // DEV: Auto guesses
  useMock(() => {
    onSubmitGuesses({ guesses: mockGuesses(groupedItems, players, user) });
  }, []);

  const playerCount = Object.keys(players).length;
  const isAllComplete =
    Object.values(guesses).length === playerCount - 1 &&
    Object.values(guesses).every((guess) => guess.weaponId && guess.evidenceId);
  const activeCrime = crimes.find((crime) => crime.playerId === activePlayerId);
  const isOwnCrime = activePlayerId === user.id;
  const activePlayerGuesses = guesses?.[activePlayerId] ?? {};

  // TODO: if last guess was CORRECT or LOCK, auto-guess
  const lastGuessHistory = getLastItem(getHistory(user.history, activePlayerId));
  const isLocked = ['CORRECT', 'LOCKED'].includes(lastGuessHistory?.status);

  // Active stuff
  const { activeWeaponId, activeEvidenceId } = getActiveStuff(
    isOwnCrime,
    isLocked,
    user,
    activePlayerGuesses,
    lastGuessHistory
  );

  // useEffect(() => {
  //   if (!isOwnCrime) {

  //   }
  // }, [])

  return (
    <Step>
      <Title>
        <Translate pt="Quais foram os crimes?" en="What were the crimes?" />
      </Title>
      <Instruction contained>
        <Translate
          pt={
            <>
              Para cada crime, selecione as respostas que você acha correta.
              <br />
              Cada jogador tem o seu par de arma e objeto.
            </>
          }
          en={
            <>
              For each crime, select the answer you think best matches the clues.
              <br />
              Each player has their weapon and object.
            </>
          }
        />
      </Instruction>

      {isDevEnv && (
        <Button type="dashed" ghost onClick={() => setGuesses(mockGuesses(groupedItems, players, user))}>
          Random
        </Button>
      )}

      <PlayersCards
        user={user}
        activePlayerId={activePlayerId}
        setActivePlayerId={setActivePlayerId}
        players={players}
        guesses={guesses}
      />

      {isAllComplete && (
        <ButtonContainer>
          <Button
            size="large"
            type="primary"
            disabled={!isAllComplete}
            onClick={() => onSubmitGuesses({ guesses })}
          >
            <Translate pt="Enviar Respostas" en="Send Guesses" />
          </Button>
        </ButtonContainer>
      )}

      <SelectableGroupedItemsBoard
        items={items}
        weaponId={activeWeaponId}
        evidenceId={activeEvidenceId}
        groupedItems={groupedItems}
        onSelectItem={onUpdateGuesses}
        activeColor={getAvatarColorById(players[activePlayerId]?.avatarId)}
        isLocked={isOwnCrime || isLocked}
        wrongGroups={user?.wrongGroups?.[activePlayerId] ?? []}
      />

      <ReadyPlayersBar players={players} />

      {activeCrime && (
        <FloatingHand type="stats">
          <Crime
            key={`crime-by-${activeCrime.playerId}`}
            crime={activeCrime}
            scenes={scenes}
            scenesOrder={scenesOrder}
            items={items}
            history={user?.history[activeCrime.playerId] ?? {}}
            player={players[activeCrime.playerId]}
            selectedWeaponId={activeWeaponId}
            selectedEvidenceId={activeEvidenceId}
          />
        </FloatingHand>
      )}
    </Step>
  );
}

const getActiveStuff = (
  isOwnCrime: boolean,
  isLocked: boolean,
  user: GamePlayer,
  activePlayerGuesses: any,
  lastGuessHistory: GuessHistoryEntry
): { activeWeaponId: string; activeEvidenceId: string } => {
  if (isOwnCrime) {
    return {
      activeWeaponId: user.weaponId,
      activeEvidenceId: user.evidenceId,
    };
  }

  if (isLocked) {
    return {
      activeWeaponId: lastGuessHistory.weaponId,
      activeEvidenceId: lastGuessHistory.evidenceId,
    };
  }

  return {
    activeWeaponId: activePlayerGuesses.weaponId,
    activeEvidenceId: activePlayerGuesses.evidenceId,
  };
};
