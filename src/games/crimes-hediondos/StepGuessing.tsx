import { useEffect, useMemo, useState } from 'react';
// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Hooks
import { useMock } from 'hooks/useMock';
// Utils
import { getAvatarColorById, getLastItem } from 'utils/helpers';
// Icons
import { InvestigationIcon } from 'icons/InvestigationIcon';
// Components
import { SendButton } from 'components/buttons';
import { DebugOnly, DevButton } from 'components/debug';
import { FloatingHand } from 'components/general/FloatingHand';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
// Internal
import type {
  Crime,
  GroupedItems,
  Guess,
  GuessHistoryEntry,
  ItemsDict,
  ScenesDict,
  SubmitGuessesPayload,
} from './utils/types';
import { mockGuesses } from './utils/mock';
import { autoSelectCorrectGuesses, getHistory } from './utils/helpers';
import { GUESS_STATUS } from './utils/constants';
import { CrimeSummary } from './components/CrimeSummary';
import { PlayersCards } from './components/PlayersCards';
import { SelectableGroupedItemsBoard } from './components/SelectableGroupedItemsBoard';

type StepGuessingProps = {
  user: GamePlayer;
  players: GamePlayers;
  items: ItemsDict;
  groupedItems: GroupedItems;
  scenes: ScenesDict;
  scenesOrder: string[];
  crimes: Crime[];
  onSubmitGuesses: (payload: SubmitGuessesPayload) => void;
  isVictimGame: boolean;
  isLocationGame: boolean;
} & Pick<StepProps, 'announcement'>;

export function StepGuessing({
  user,
  groupedItems,
  items,
  players,
  scenes,
  scenesOrder,
  crimes,
  onSubmitGuesses,
  announcement,
  isVictimGame,
  isLocationGame,
}: StepGuessingProps) {
  const [guesses, setGuesses] = useState<Dictionary<Guess>>({});
  const [activePlayerId, setActivePlayerId] = useState<PlayerId>('');

  // DEV: Auto guesses
  useMock(() => {
    onSubmitGuesses({ guesses: mockGuesses(groupedItems, players, user, isVictimGame, isLocationGame) });
  }, []);

  // If last guess was CORRECT or LOCK, auto-guess
  useEffect(() => {
    setGuesses((g) => ({ ...g, ...autoSelectCorrectGuesses(user.history) }));
  }, [user.history]);

  const onUpdateGuesses = (itemId: string) => {
    if (activePlayerId && itemId) {
      const guessObj = {
        ...(guesses[activePlayerId] ?? {
          weaponId: undefined,
          evidenceId: undefined,
          victimId: undefined,
          locationId: undefined,
          isComplete: false,
        }),
      };

      if (itemId.includes('wp')) {
        guessObj.weaponId = itemId;
      }
      if (itemId.includes('ev')) {
        guessObj.evidenceId = itemId;
      }
      if (isVictimGame && itemId.includes('vt')) {
        guessObj.victimId = itemId;
      }
      if (isLocationGame && itemId.includes('lc')) {
        guessObj.locationId = itemId;
      }

      setGuesses((s: PlainObject) => ({
        ...s,
        [activePlayerId]: {
          ...guessObj,
          isComplete:
            !!guessObj?.weaponId &&
            !!guessObj?.evidenceId &&
            (isVictimGame ? Boolean(guessObj?.victimId) : true) &&
            (isLocationGame ? Boolean(guessObj?.locationId) : true),
        },
      }));
    }
  };

  const {
    isAllComplete,
    activeCrime,
    isOwnCrime,
    isLocked,
    activeWeaponId,
    activeEvidenceId,
    activeVictimId,
    activeLocationId,
  } = useMemo(() => {
    const playerCount = Object.keys(players).length;
    const isAllComplete =
      Object.values(guesses).length === playerCount - 1 &&
      Object.values(guesses).every(
        (guess) =>
          guess.weaponId &&
          guess.evidenceId &&
          (isVictimGame ? guess.victimId : true) &&
          (isLocationGame ? guess.locationId : true),
      );
    const activeCrime = crimes.find((crime) => crime.playerId === activePlayerId);
    const isOwnCrime = activePlayerId === user.id;
    const activePlayerGuesses = guesses?.[activePlayerId] ?? {};

    const lastGuessHistory = getLastItem(getHistory(user.history, activePlayerId));
    const isLocked = [GUESS_STATUS.CORRECT, GUESS_STATUS.LOCKED].includes(lastGuessHistory?.status);

    // Active stuff
    const { activeWeaponId, activeEvidenceId, activeVictimId, activeLocationId } = getActiveStuff(
      isOwnCrime,
      isLocked,
      user,
      activePlayerGuesses,
      lastGuessHistory,
    );

    return {
      isAllComplete,
      activeCrime,
      isOwnCrime,
      isLocked,
      activeWeaponId,
      activeEvidenceId,
      activeVictimId,
      activeLocationId,
    };
  }, [user, activePlayerId, guesses, crimes, players, isVictimGame, isLocationGame]);

  return (
    <Step announcement={announcement}>
      <StepTitle>
        <Translate pt="Quais foram os crimes?" en="What were the crimes?" />
      </StepTitle>

      <RuleInstruction type="action">
        <Translate
          pt={
            <>
              Selecione cada jogador abaixo, analise suas respostas sobre o crime, e selecione as cartas que
              compõem o crime.
              <br />
              As cartas sempre estarão no mesmo quadrante, mas elas não são exclusivas a um jogador e
              diferentes crimes podem usar as mesmas cartas.
              <br />
              Crimes que já tem todas as cartas selecionados são indicados por uma faca.
            </>
          }
          en={
            <>
              Select each player below, analyze their answers about the crime, and select the cards that make
              up the crime.
              <br />
              The cards will always be in the same quadrant, but they are not exclusive to one player and
              different crimes can use the same cards.
              <br />
              Crimes that already have all cards selected are indicated by a knife.
            </>
          }
        />
      </RuleInstruction>

      <DebugOnly dev>
        <SpaceContainer>
          <DevButton
            onClick={() => setGuesses(mockGuesses(groupedItems, players, user, isVictimGame, isLocationGame))}
          >
            <Translate pt="Seleção Aleatória Semi-inteligente" en="Semi-intelligent Random Selection" />
          </DevButton>
        </SpaceContainer>
      </DebugOnly>

      {isAllComplete && (
        <SpaceContainer align="center">
          <SendButton size="large" disabled={!isAllComplete} onClick={() => onSubmitGuesses({ guesses })}>
            <Translate pt="Enviar Respostas" en="Send Guesses" />
          </SendButton>
        </SpaceContainer>
      )}

      <PlayersCards
        user={user}
        setActivePlayerId={setActivePlayerId}
        players={players}
        guesses={guesses}
        history={user.history}
      >
        <SelectableGroupedItemsBoard
          items={items}
          weaponId={activeWeaponId}
          evidenceId={activeEvidenceId}
          victimId={activeVictimId}
          locationId={activeLocationId}
          groupedItems={groupedItems}
          onSelectItem={onUpdateGuesses}
          activeColor={activePlayerId ? getAvatarColorById(players[activePlayerId]?.avatarId) : undefined}
          isLocked={isOwnCrime || isLocked}
          wrongGroups={user?.wrongGroups?.[activePlayerId] ?? []}
          wrongItems={user?.wrongItems?.[activePlayerId] ?? []}
        />
      </PlayersCards>

      {activeCrime && (
        <FloatingHand title="Crime" icon={<InvestigationIcon />}>
          <CrimeSummary
            key={`crime-by-${activeCrime.playerId}`}
            crime={activeCrime}
            scenes={scenes}
            scenesOrder={scenesOrder}
            items={items}
            history={user?.history[activeCrime.playerId] ?? []}
            player={players[activeCrime.playerId]}
            isLocked={isOwnCrime || isLocked}
            selectedWeaponId={activeWeaponId}
            selectedEvidenceId={activeEvidenceId}
            selectedVictimId={activeVictimId}
            selectedLocationId={activeLocationId}
            isLocationGame={isLocationGame}
            isVictimGame={isVictimGame}
          />
        </FloatingHand>
      )}

      {/* This makes sure people can open the floating hand and still see all ItemBoard */}
      <div className="h-empty-space"></div>
    </Step>
  );
}

const getActiveStuff = (
  isOwnCrime: boolean,
  isLocked: boolean,
  user: GamePlayer,
  activePlayerGuesses: Guess,
  lastGuessHistory: GuessHistoryEntry,
): {
  activeWeaponId: string;
  activeEvidenceId: string;
  activeVictimId?: string;
  activeLocationId?: string;
} => {
  if (isOwnCrime) {
    return {
      activeWeaponId: user.weaponId,
      activeEvidenceId: user.evidenceId,
      activeVictimId: user.victimId,
      activeLocationId: user.locationId,
    };
  }

  if (isLocked) {
    return {
      activeWeaponId: lastGuessHistory.weaponId,
      activeEvidenceId: lastGuessHistory.evidenceId,
      activeVictimId: lastGuessHistory.victimId,
      activeLocationId: lastGuessHistory.locationId,
    };
  }

  return {
    activeWeaponId: activePlayerGuesses.weaponId,
    activeEvidenceId: activePlayerGuesses.evidenceId,
    activeVictimId: activePlayerGuesses.victimId,
    activeLocationId: activePlayerGuesses.locationId,
  };
};
