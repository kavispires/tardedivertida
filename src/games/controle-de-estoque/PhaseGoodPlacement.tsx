import { orderBy } from 'lodash';
import { useMemo } from 'react';
// Types
import type { PhaseProps } from 'types/game';
import type { BossIdeaCard } from 'types/tdr';
// Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { BossIdeaIcon } from 'icons/BossIdeaIcon';
// Components
import { PlayerAvatarName } from 'components/avatars';
import { DualTranslate, Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { RoundAnnouncement } from 'components/round';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { CONTROLE_DE_ESTOQUE_PHASES, DAYS_OF_THE_WEEK } from './utils/constants';
import { useOnPlaceGoodAPIRequest } from './utils/api-requests';
import { StepPlaceGood } from './StepPlaceGood';

export function PhaseGoodPlacement({ players, state, user }: PhaseProps) {
  const [supervisor, isUserTheSupervisor] = useWhichPlayerIsThe('supervisorId', state, players);

  const onPlaceGood = useOnPlaceGoodAPIRequest();

  // If roundGoodsIndex is 0, show round announcement and boss idea
  const { step, goToNextStep } = useStep(state.roundGoodsIndex === 0 ? 0 : 1);
  const bossIdea: BossIdeaCard = state?.bossIdea;

  const announcement = (
    <PhaseAnnouncement
      icon={<BossIdeaIcon />}
      title={<DualTranslate>{bossIdea.subtitle}</DualTranslate>}
      currentRound={state?.round?.current}
      type="overlay"
      duration={state.roundGoodsIndex === 0 ? 15 : 5}
    >
      <Instruction>
        "<Translate en="The floor supervisor for the day will be" pt="O supervisor do dia será" />{' '}
        <PlayerAvatarName player={supervisor} addressUser />
        ."
      </Instruction>
    </PhaseAnnouncement>
  );

  const warehouse = useMemo(() => orderBy(state.warehouseGrid, ['id']), [state.warehouseGrid]);

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={CONTROLE_DE_ESTOQUE_PHASES.GOOD_PLACEMENT}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <RoundAnnouncement
          round={state?.round}
          onPressButton={goToNextStep}
          time={state.roundGoodsIndex === 0 ? 10 : 4}
        >
          <Instruction contained>
            <DualTranslate>{DAYS_OF_THE_WEEK[state.round.current - 1]}</DualTranslate>
          </Instruction>
          {/* <DevSetState state={demo} gameId="CCCC" gameName="controle-de-estoque" /> */}
        </RoundAnnouncement>

        <StepPlaceGood
          user={user}
          players={players}
          announcement={announcement}
          bossIdea={bossIdea}
          roundGoods={state.roundGoods ?? []}
          roundsGoodIndex={state.roundsGoodIndex}
          goodsDict={state.goodsDict}
          warehouse={warehouse}
          supervisor={supervisor}
          isUserTheSupervisor={isUserTheSupervisor}
          onPlaceGood={onPlaceGood}
          stocked={state.stocked}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
