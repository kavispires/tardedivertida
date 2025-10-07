// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { WritingIcon } from 'icons/WritingIcon';
// Components
import { AvatarName } from 'components/avatars';
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { TurnOrder } from 'components/players';
import { RoundAnnouncement } from 'components/round';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { useOnSubmitFeatureAPIRequest } from './utils/api-requests';
import { MESMICE_PHASES } from './utils/constants';
import { WaitingRoomFeature } from './components/WaitingRoomFeature';
import { StepSelectFeature } from './StepSelectFeature';

export function PhaseObjectFeatureElimination({ state, players, user }: PhaseProps) {
  const [activePlayer, isUserTheActivePlayer] = useWhichPlayerIsThe('activePlayerId', state, players);
  const initialStep = state.outcome === 'NEW' ? 0 : 1;
  const { step, setStep, goToNextStep } = useStep(initialStep);

  const onSubmitFeature = useOnSubmitFeatureAPIRequest(setStep, initialStep + 1);

  const announcement = (
    <PhaseAnnouncement
      icon={<WritingIcon />}
      title={<Translate pt="Objeto e característica" en="Object vs Feature" />}
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Instruction>
        <Translate
          pt={
            <>
              Neste jogo, você escreverá uma dica que melhor conecta seu objeto com a característica sorteada.
            </>
          }
          en={
            <>
              In this game, you will write a clue that best connects your object with the assigned
              characteristic.
            </>
          }
        />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={MESMICE_PHASES.OBJECT_FEATURE_ELIMINATION}>
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
        <RoundAnnouncement round={state?.round} onPressButton={goToNextStep} buttonText=" " time={5}>
          <Translate
            pt={
              <>
                Vamos analisar os objetos de <AvatarName player={activePlayer} />.
              </>
            }
            en={
              <>
                Let's analyze <AvatarName player={activePlayer} />
                's objects.
              </>
            }
          />
          <TurnOrder players={players} order={state.turnOrder} activePlayerId={state.activePlayerId} />
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
