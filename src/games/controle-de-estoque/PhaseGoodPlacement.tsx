import { useEffect, useMemo, useState } from 'react';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from '@hooks/useStep';
import { useWhichPlayerIsThe } from '@hooks/useWhichPlayerIsThe';
// Icons
import { BarcodeIcon } from '@icons/BarcodeIcon';
import { BossIdeaIcon } from '@icons/BossIdeaIcon';
import { ShippingBoxIcon } from '@icons/ShippingBoxIcon';
// Components
import { DualTranslate } from '@components/language/DualTranslate';
import { Translate } from '@components/language/Translate';
import { PhaseAnnouncement } from '@components/phases/PhaseAnnouncement';
import { PhaseContainer } from '@components/phases/PhaseContainer';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
import { RoundAnnouncement } from '@components/round/RoundAnnouncement';
import { StepSwitcher } from '@components/steps/StepSwitcher';
import { Instruction } from '@components/text/Instruction';
// Internal
import { CONTROLE_DE_ESTOQUE_PHASES, DAYS_OF_THE_WEEK, OUTCOME } from './utils/constants';
import { useOnConfirmGoodPlacementAPIRequest, useOnPlaceGoodAPIRequest } from './utils/api-requests';
import type { PhaseGoodPlacementState } from './utils/types';
import { useWarehouse } from './utils/hooks';
import { RoundStockingProgress } from './components/StockingProgress';
import { StepPlaceGood } from './StepPlaceGood';
import { StepAnimatePreviousAction } from './StepAnimatePreviousAction';

export function PhaseGoodPlacement({ players, state, user }: PhaseProps<PhaseGoodPlacementState>) {
  const isNewRound = state.status.outcome === OUTCOME.NEW_IDEA;
  const { step, goToNextStep, goToStep, setStep } = useStep(0);
  const [supervisor, isUserTheSupervisor] = useWhichPlayerIsThe('supervisorId', state, players);
  const previousSupervisorId = state.event?.actorId ?? 'NULL';
  const [currentPlayerId, setCurrentPlayerId] = useState(state.supervisorId);

  const onPlaceGood = useOnPlaceGoodAPIRequest();
  const onConfirmPlacement = useOnConfirmGoodPlacementAPIRequest();

  const bossIdea = state.bossIdea;

  // biome-ignore lint/correctness/useExhaustiveDependencies: no functions
  useEffect(() => {
    if (step !== 0) {
      if (state.supervisorId !== currentPlayerId) {
        setCurrentPlayerId(state.supervisorId);
        setStep(0);
      }
    }
  }, [state.supervisorId]);

  const packingAnnouncement = useMemo(
    () => (
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
    ),
    [state?.round?.current],
  );

  const newRoundAnnouncement = useMemo(
    () => (
      <PhaseAnnouncement
        icon={<BossIdeaIcon />}
        title={<DualTranslate>{bossIdea.subtitle}</DualTranslate>}
        currentRound={state?.round?.current}
        type="overlay"
        duration={15}
      >
        <Instruction>
          {state.round.current === 1 ? (
            <>
              "
              <Translate
                en="With each product, the supervisor will be someone different, let's start with"
                pt="A cada produto o supervisor será alguém diferente, vamos começar com"
              />{' '}
              <PlayerAvatarName
                player={supervisor}
                addressUser
              />
              ."
            </>
          ) : (
            <DualTranslate>{bossIdea.description}</DualTranslate>
          )}
          <br />
          <RoundStockingProgress status={state.status} />
        </Instruction>
      </PhaseAnnouncement>
    ),
    [bossIdea.subtitle, bossIdea.description, state?.round?.current, supervisor, state.status],
  );

  const announcement = useMemo(
    () => (
      <PhaseAnnouncement
        icon={<BarcodeIcon />}
        title={
          <Translate
            pt="Próximo produto!"
            en="Next product!"
          />
        }
        currentRound={state?.round?.current}
        type="overlay"
        duration={2}
      >
        <Instruction>
          <Translate
            en="Now it's"
            pt="Agora é a vez de"
          />{' '}
          <PlayerAvatarName
            player={supervisor}
            addressUser
          />
          !{' '}
          <RoundStockingProgress
            status={state.status}
            hideTitles
          />
        </Instruction>
      </PhaseAnnouncement>
    ),
    [state?.round?.current, supervisor, state.status],
  );

  // Determine which announcement to show based on the current step
  const stepTwoAnnouncement = useMemo(() => {
    // Only show newRoundAnnouncement when we've come through step 1 (the round announcement)
    return isNewRound ? newRoundAnnouncement : announcement;
  }, [isNewRound, newRoundAnnouncement, announcement]);

  const warehouse = useWarehouse(state.warehouseGrid);

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
          key={`${previousSupervisorId}-${state.previousBossIdea?.id ?? ''}`} // Force remount when previous player changes to reset internal states
          user={user}
          players={players}
          announcement={packingAnnouncement}
          bossIdea={state.previousBossIdea ?? bossIdea} // Use the previous boss idea so the animations reflects the correct one
          goodsDict={state.goodsDict}
          warehouse={warehouse}
          previousSupervisor={players?.[previousSupervisorId] ?? null}
          status={state.status}
          event={state.event}
          turnOrder={state.turnOrder}
          goToNextStep={() => goToStep(isNewRound ? 1 : 2)}
        />

        {/* Step 1 */}
        <RoundAnnouncement
          round={state?.round}
          onPressButton={goToNextStep}
          time={4}
        >
          <Instruction contained>
            <DualTranslate>{DAYS_OF_THE_WEEK[state.round.current - 1]}</DualTranslate>
          </Instruction>
        </RoundAnnouncement>

        {/* Step 2 */}
        <StepPlaceGood
          key={state.supervisorId}
          user={user}
          players={players}
          announcement={stepTwoAnnouncement}
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
