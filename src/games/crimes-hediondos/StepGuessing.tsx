import { useEffect, useState } from 'react';
// Ant Design Resources
import { Button } from 'antd';
// Hooks
import { useMock } from 'hooks';
// Utils
import { getAvatarColorById, getLastItem } from 'utils/helpers';
import { mockGuesses } from './mock';
import { autoSelectCorrectGuesses, getHistory } from './helpers';
// Components
import {
  ButtonContainer,
  DebugOnly,
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

  // DEV: Auto guesses
  useMock(() => {
    onSubmitGuesses({ guesses: mockGuesses(groupedItems, players, user) });
  }, []);

  // If last guess was CORRECT or LOCK, auto-guess
  useEffect(() => {
    setGuesses((g) => ({ ...g, ...autoSelectCorrectGuesses(user.history) }));
  }, [user]);

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

  const playerCount = Object.keys(players).length;
  const isAllComplete =
    Object.values(guesses).length === playerCount - 1 &&
    Object.values(guesses).every((guess) => guess.weaponId && guess.evidenceId);
  const activeCrime = crimes.find((crime) => crime.playerId === activePlayerId);
  const isOwnCrime = activePlayerId === user.id;
  const activePlayerGuesses = guesses?.[activePlayerId] ?? {};

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

  return (
    <Step>
      <Title>
        <Translate pt="Quais foram os crimes?" en="What were the crimes?" />
      </Title>
      <Instruction contained>
        <Translate
          pt={
            <>
              Selecione cada jogador abaixo, analise suas respostas sobre o crime, e selecione uma arma e um
              objeto.
              <br />O par sempre estará no mesmo quadrante, mas os objetos não são exclusivos e diferentes
              crimes podem usar as mesmas cartas.
              <br />
              Crimes que já tem ambos selecionados são indicados por uma faca.
            </>
          }
          en={
            <>
              Select each player below, analyze their answers about their crimes, then select a weapon and an
              object.
              <br />
              The pair will always be in the same quadrant, but object are non-exclusive so different crimes
              might use the same cards.
              <br />
              Crimes with both cards selected are indicated by a knife.
            </>
          }
        />
      </Instruction>

      <DebugOnly dev>
        <ButtonContainer>
          <Button type="dashed" ghost onClick={() => setGuesses(mockGuesses(groupedItems, players, user))}>
            <Translate pt="Seleção Aleatória Semi-inteligente" en="Semi-intelligent Random Selection" />
          </Button>
        </ButtonContainer>
      </DebugOnly>

      <PlayersCards
        user={user}
        activePlayerId={activePlayerId}
        setActivePlayerId={setActivePlayerId}
        players={players}
        guesses={guesses}
        history={user.history}
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
            history={user?.history[activeCrime.playerId] ?? []}
            player={players[activeCrime.playerId]}
            selectedWeaponId={activeWeaponId}
            selectedEvidenceId={activeEvidenceId}
            isLocked={isOwnCrime || isLocked}
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
