import { orderBy } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { BossIdeaIcon } from 'icons/BossIdeaIcon';
import { MysteryBoxIcon } from 'icons/MysteryBoxIcon';
import { ShippingBoxIcon } from 'icons/ShippingBoxIcon';
// Components
import { DualTranslate } from 'components/language/DualTranslate';
import { Translate } from 'components/language/Translate';
import { PhaseAnnouncement } from 'components/phases/PhaseAnnouncement';
import { PhaseContainer } from 'components/phases/PhaseContainer';
import { PlayerAvatarName } from 'components/player/PlayerAvatarName';
import { RoundAnnouncement } from 'components/round/RoundAnnouncement';
import { StepSwitcher } from 'components/steps/StepSwitcher';
import { Instruction } from 'components/text/Instruction';
// Internal
import { CONTROLE_DE_ESTOQUE_PHASES, DAYS_OF_THE_WEEK, OUTCOME } from './utils/constants';
import { useOnConfirmGoodPlacementAPIRequest, useOnPlaceGoodAPIRequest } from './utils/api-requests';
import type { PhaseGoodPlacementState } from './utils/types';
import { StepPlaceGood } from './StepPlaceGood';
import { StepAnimatePreviousAction } from './StepAnimatePreviousAction';

export function PhaseGoodPlacement({ players, state, user }: PhaseProps<PhaseGoodPlacementState>) {
  const isNewRound = state.status.outcome === OUTCOME.NEW_IDEA;
  const startingStep = isNewRound ? 0 : 1;
  const { step, goToNextStep, goToSteps, setStep } = useStep(startingStep);
  const [supervisor, isUserTheSupervisor] = useWhichPlayerIsThe('supervisorId', state, players);
  const previousPlayerId = state.event?.actorId ?? 'NULL';
  const [currentPlayerId, setCurrentPlayerId] = useState(state.supervisorId);

  const onPlaceGood = useOnPlaceGoodAPIRequest();
  const onConfirmPlacement = useOnConfirmGoodPlacementAPIRequest();

  const bossIdea = state?.bossIdea;

  // biome-ignore lint/correctness/useExhaustiveDependencies: no functions
  useEffect(() => {
    if (step !== startingStep) {
      if (state.supervisorId !== currentPlayerId) {
        setCurrentPlayerId(state.supervisorId);
        setStep(0);
      }
    }
  }, [startingStep, state.supervisorId]);

  const packingAnnouncement = (
    <PhaseAnnouncement
      icon={<ShippingBoxIcon />}
      title="Vamos embalar esses produtos!"
      currentRound={state?.round?.current}
      type="overlay"
      duration={2}
    >
      <Instruction>
        <Translate
          en="Remember where they are!"
          pt="Lembre-se de onde eles estão!"
        />
      </Instruction>
    </PhaseAnnouncement>
  );

  const announcement = (
    <PhaseAnnouncement
      icon={isNewRound ? <BossIdeaIcon /> : <MysteryBoxIcon />}
      title={
        isNewRound ? (
          <DualTranslate>{bossIdea.subtitle}</DualTranslate>
        ) : (
          <Translate
            pt="Próximo produto!"
            en="Next product!"
          />
        )
      }
      currentRound={state?.round?.current}
      type="overlay"
      duration={isNewRound ? 6 : 2}
    >
      <Instruction>
        "
        <Translate
          en="The floor supervisor for the turn will be"
          pt="O supervisor do turno será"
        />{' '}
        <PlayerAvatarName
          player={supervisor}
          addressUser
        />
        ."
      </Instruction>
    </PhaseAnnouncement>
  );

  const warehouse = useMemo(() => orderBy(state.warehouseGrid, ['id']), [state.warehouseGrid]);

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={CONTROLE_DE_ESTOQUE_PHASES.GOOD_PLACEMENT}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <StepAnimatePreviousAction
          key={previousPlayerId} // Force remount when previous player changes to reset internal states
          user={user}
          players={players}
          announcement={packingAnnouncement}
          bossIdea={bossIdea}
          goodsDict={state.goodsDict}
          warehouse={warehouse}
          previousSupervisor={players?.[previousPlayerId]}
          status={state.status}
          currentGoodId={state.currentGoodId}
          event={state.event}
          turnOrder={state.turnOrder}
          goToNextStep={() => goToSteps(isNewRound ? 1 : 2)}
        />

        {/* Step 2 */}
        <RoundAnnouncement
          round={state?.round}
          onPressButton={goToNextStep}
          time={4}
        >
          <Instruction contained>
            <DualTranslate>{DAYS_OF_THE_WEEK[state.round.current - 1]}</DualTranslate>
          </Instruction>
        </RoundAnnouncement>

        {/* Step 3 */}
        <StepPlaceGood
          key={state.supervisorId}
          user={user}
          players={players}
          announcement={announcement}
          bossIdea={bossIdea}
          goodsDict={state.goodsDict}
          warehouse={warehouse}
          supervisor={supervisor}
          isUserTheSupervisor={isUserTheSupervisor}
          status={state.status}
          currentGoodId={state.currentGoodId}
          turnOrder={state.turnOrder}
          onPlaceGood={onPlaceGood}
          onConfirmPlacement={onConfirmPlacement}
          selectedWarehouseSlot={state.selectedWarehouseSlot ?? null}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
