import { Fragment } from 'react/jsx-runtime';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { GamblingChipIcon } from 'icons/GamblingChipIcon';
// Components
import { Translate } from 'components/language/Translate';
import { PhaseAnnouncement } from 'components/phases/PhaseAnnouncement';
import { PhaseContainer } from 'components/phases/PhaseContainer';
import { StepSwitcher } from 'components/steps/StepSwitcher';
import { Instruction } from 'components/text/Instruction';
import { ViewIf } from 'components/views/ViewIf';
// Internal
import type { PhaseBetsState } from './utils/types';
import { useOnSubmitBetsAPIRequest } from './utils/api-requests';
import { ESQUIADORES_PHASES } from './utils/constants';
import { CurrentBets, CurrentSkierBets } from './components/CurrentBets';
import { SnowEffect } from '../../components/visual-effects/SnowEffect';
import { StepMakeBets } from './StepMakeBets';
import { StepChooseLodges } from './StepChooseLodges';

export function PhaseLastChance({ players, state, user }: PhaseProps<PhaseBetsState>) {
  const { step, setStep } = useStep();
  const [skier, isUserSkier] = useWhichPlayerIsThe('activeSkierId', state, players);

  const onSubmitBets = useOnSubmitBetsAPIRequest(setStep);

  const announcement = isUserSkier ? (
    <PhaseAnnouncement
      icon={<GamblingChipIcon />}
      title={
        <Translate
          pt="Aposte nos jogadores"
          en="Bet on the players"
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
      duration={5}
    ></PhaseAnnouncement>
  ) : (
    <PhaseAnnouncement
      icon={<GamblingChipIcon />}
      title={
        <Translate
          pt="Aposta Final"
          en="Final Bet"
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
      duration={5}
    >
      <Instruction>
        <Translate
          pt="Escolha sua cabana final"
          en="Choose your final lodge"
        />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={ESQUIADORES_PHASES.LAST_CHANGE}
    >
      <SnowEffect />
      <StepSwitcher
        step={step}
        players={players}
        waitingRoom={{
          content: isUserSkier ? (
            <CurrentSkierBets
              user={user}
              lodges={state.lodges}
            />
          ) : (
            <CurrentBets
              user={user}
              lodges={state.lodges}
              betType="final"
            />
          ),
        }}
      >
        {/* Step 1 */}
        <Fragment>
          <ViewIf condition={isUserSkier}>
            <StepChooseLodges
              announcement={announcement}
              players={players}
              turnOrder={state.turnOrder}
              user={user}
              skier={skier}
              mountain={state.mountain}
              lodges={state.lodges}
              onSubmitBets={onSubmitBets}
              betType="final"
              animateFrom={state.animateFrom}
              animateTo={state.animateTo}
              skierBetType="skiersBoost"
            />
          </ViewIf>
          <ViewIf condition={!isUserSkier}>
            <StepMakeBets
              announcement={announcement}
              players={players}
              turnOrder={state.turnOrder}
              user={user}
              skier={skier}
              mountain={state.mountain}
              lodges={state.lodges}
              onSubmitBets={onSubmitBets}
              betType="final"
              animateFrom={state.animateFrom}
              animateTo={state.animateTo}
            />
          </ViewIf>
        </Fragment>
      </StepSwitcher>
    </PhaseContainer>
  );
}
