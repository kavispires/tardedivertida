// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from '@hooks/useStep';
import { useWhichPlayerIsThe } from '@hooks/useWhichPlayerIsThe';
// Icons
import { WritingIcon } from '@icons/WritingIcon';
// Components
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { PhaseAnnouncement } from '@components/phases/PhaseAnnouncement';
import { PhaseContainer } from '@components/phases/PhaseContainer';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
import { PlayersTurnOrder } from '@components/players/PlayersTurnOrder';
import { RoundAnnouncement } from '@components/round/RoundAnnouncement';
import { StepSwitcher } from '@components/steps/StepSwitcher';
// Internal
import { useOnSubmitFeatureAPIRequest } from './utils/api-requests';
import { MESMICE_PHASES } from './utils/constants';
import type { PhaseObjectFeatureEliminationState } from './utils/types';
import { WaitingRoomFeature } from './components/WaitingRoomFeature';
import { StepSelectFeature } from './StepSelectFeature';

export function PhaseObjectFeatureElimination({
  state,
  players,
  user,
}: PhaseProps<PhaseObjectFeatureEliminationState>) {
  const [activePlayer, isUserTheActivePlayer] = useWhichPlayerIsThe('activePlayerId', state, players);
  const initialStep = state.outcome === 'NEW' ? 0 : 1;
  const { step, setStep, goToNextStep } = useStep(initialStep);

  const onSubmitFeature = useOnSubmitFeatureAPIRequest(setStep, initialStep + 1);

  const announcement = (
    <PhaseAnnouncement
      icon={<WritingIcon />}
      title={
        <Translate
          pt="Objeto e característica"
          en="Object vs Feature"
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Surface>
        <Translate
          pt="Neste jogo, você escreverá uma dica que melhor conecta seu objeto com a característica sorteada."
          en={
            <>
              In this game, you will write a clue that best connects your object with the assigned
              characteristic.
            </>
          }
        />
      </Surface>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={MESMICE_PHASES.OBJECT_FEATURE_ELIMINATION}
    >
      <StepSwitcher
        step={step}
        players={players}
        waitingRoom={{
          content: (
            <WaitingRoomFeature
              activePlayer={activePlayer}
              item={state.item}
              clue={state.clue}
              selectedFeatureId={user.selectedFeatureId}
              features={state.features}
            />
          ),
        }}
      >
        {/* Step 0 */}
        <RoundAnnouncement
          round={state?.round}
          onPressButton={goToNextStep}
          buttonText=" "
          time={5}
        >
          <Translate
            pt={
              <>
                Vamos analisar os objetos de <PlayerAvatarName player={activePlayer} />.
              </>
            }
            en={
              <>
                Let's analyze <PlayerAvatarName player={activePlayer} />
                's objects.
              </>
            }
          />
          <PlayersTurnOrder
            players={players}
            order={state.turnOrder}
            activePlayerId={state.activePlayerId}
          />
        </RoundAnnouncement>

        {/* Step 1 */}
        <StepSelectFeature
          user={user}
          features={state.features}
          activePlayer={activePlayer}
          item={state.item}
          clue={state.clue}
          onEliminate={onSubmitFeature}
          isUserTheActivePlayer={isUserTheActivePlayer}
          history={state.history}
          announcement={announcement}
          groupScore={state.groupScore}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
