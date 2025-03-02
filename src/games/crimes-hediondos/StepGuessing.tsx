import { useEffect, useState } from 'react';
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
}: StepGuessingProps) {
  const [guesses, setGuesses] = useState<Dictionary<Guess>>({});
  const [activePlayerId, setActivePlayerId] = useState<PlayerId>('');

  // DEV: Auto guesses
  useMock(() => {
    onSubmitGuesses({ guesses: mockGuesses(groupedItems, players, user) });
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
    lastGuessHistory,
  );

  return (
    <Step announcement={announcement}>
      <StepTitle>
        <Translate pt="Quais foram os crimes?" en="What were the crimes?" />
      </StepTitle>

      <RuleInstruction type="action">
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
      </RuleInstruction>

      <DebugOnly dev>
        <SpaceContainer>
          <DevButton onClick={() => setGuesses(mockGuesses(groupedItems, players, user))}>
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
          groupedItems={groupedItems}
          onSelectItem={onUpdateGuesses}
          activeColor={activePlayerId ? getAvatarColorById(players[activePlayerId]?.avatarId) : undefined}
          isLocked={isOwnCrime || isLocked}
          wrongGroups={user?.wrongGroups?.[activePlayerId] ?? []}
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
            selectedWeaponId={activeWeaponId}
            selectedEvidenceId={activeEvidenceId}
            isLocked={isOwnCrime || isLocked}
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
