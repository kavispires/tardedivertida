// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
import { PHASES } from 'utils/phases';
// Icons
// Components
import { DualTranslate, Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { StepPlaceGood } from './StepPlaceGood';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
import { RoundAnnouncement } from 'components/round';
import { DAYS_OF_THE_WEEK } from './utils/constants';
import { BossIdeaCard } from 'types/tdr';
import { BossIdeaIcon } from 'icons/BossIdeaIcon';
import { AvatarName } from 'components/avatars';
import { useOnPlaceGoodAPIRequest } from './utils/api-requests';
import { useMemo } from 'react';
import { orderBy } from 'lodash';
import { DevSetState } from 'components/debug/DevSetState';
import { demo } from './utils/demo';

export function PhaseGoodPlacement({ players, state, info }: PhaseProps) {
  const user = useUser(players, state);
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
        <AvatarName player={supervisor} addressUser />
        ."
      </Instruction>
    </PhaseAnnouncement>
  );

  const warehouse = useMemo(() => orderBy(state.warehouseGrid, ['id']), [state.warehouseGrid]);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.CONTROLE_DE_ESTOQUE.GOOD_PLACEMENT}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <RoundAnnouncement
          round={state?.round}
          onPressButton={goToNextStep}
          time={state.roundGoodsIndex === 0 ? 10 : 4}
          circleColor={info?.appearance?.color}
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