// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Utils
import { PHASES } from 'utils/phases';
// Icons
import { MysteryBoxIcon } from 'icons/MysteryBoxIcon';
// Components
import { AlienText } from 'components/alien/AlienText';
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { useOnStopDeliveryAPIRequest, useOnSubmitDeliveryAPIRequest } from './utils/api-requests';
import { StepDeliver } from './StepDeliver';
// Icons

export function PhaseDeliveringSomething({ players, state }: PhaseProps) {
  const user = useUser(players, state);
  const { step } = useStep();
  const [requester, isTheRequester] = useWhichPlayerIsThe('requesterId', state, players);

  const onSubmitDelivery = useOnSubmitDeliveryAPIRequest();
  const onStopDelivery = useOnStopDeliveryAPIRequest();

  const latestHistoryEntry = state.history[state.history.length - 1];
  const hasADelivery = latestHistoryEntry.deliverables.length > 0;

  const announcement = (
    <PhaseAnnouncement
      icon={<MysteryBoxIcon />}
      title={<Translate pt="Por favor, me vê aí..." en="Please give me..." />}
      currentRound={state?.round?.current}
      type="overlay"
      duration={3}
    >
      <Instruction>
        <AlienText value={state.clue ?? ''} />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={PHASES.COMUNICACAO_DUO.DELIVER_SOMETHING}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <StepDeliver
          user={user}
          players={players}
          announcement={hasADelivery ? undefined : announcement}
          deckType={state.deckType}
          deck={state.deck}
          status={state.status}
          history={state.history}
          requester={requester}
          isTheRequester={isTheRequester}
          summary={state.summary}
          clueInputType={state.clueInputType}
          clue={state.clue}
          clueQuantity={state.clueQuantity}
          onSubmitDelivery={onSubmitDelivery}
          onStopDelivery={onStopDelivery}
          round={state.round}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
