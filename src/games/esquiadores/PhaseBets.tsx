import { Fragment } from 'react/jsx-runtime';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from '@hooks/useStep';
import { useWhichPlayerIsThe } from '@hooks/useWhichPlayerIsThe';
// Icons
import { GamblingChipIcon } from '@icons/GamblingChipIcon';
import { QuestionIcon } from '@icons/QuestionIcon';
// Components
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { PhaseAnnouncement } from '@components/phases/PhaseAnnouncement';
import { PhaseContainer } from '@components/phases/PhaseContainer';
import { PlayersTurnOrder } from '@components/players/PlayersTurnOrder';
import { RoundAnnouncement } from '@components/round/RoundAnnouncement';
import { StepSwitcher } from '@components/steps/StepSwitcher';
import { ViewIf } from '@components/views/ViewIf';
// Internal
import type { PhaseBetsState } from './utils/types';
import { useOnSubmitBetsAPIRequest, useOnSubmitChoicesAPIRequest } from './utils/api-requests';
import { ESQUIADORES_PHASES } from './utils/constants';
import { CurrentBets } from './components/CurrentBets';
import { SnowEffect } from '../../components/visual-effects/SnowEffect';
import { StepMakeBets } from './StepMakeBets';
import { StepMakeChoices } from './StepMakeChoices';

export function PhaseBets({ state, players, user }: PhaseProps<PhaseBetsState>) {
  const { step, setStep, goToNextStep } = useStep();
  const [skier, isUserSkier] = useWhichPlayerIsThe('activeSkierId', state, players);

  const onSubmitChoices = useOnSubmitChoicesAPIRequest(setStep);
  const onSubmitBets = useOnSubmitBetsAPIRequest(setStep);

  const announcement = isUserSkier ? (
    <PhaseAnnouncement
      icon={<QuestionIcon />}
      title={
        <Translate
          pt="Responda as perguntas"
          en="Answer the questions"
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
      duration={5}
    >
      <Surface>
        <Translate
          pt="Responda as perguntas"
          en="Answer the questions"
        />
      </Surface>
    </PhaseAnnouncement>
  ) : (
    <PhaseAnnouncement
      icon={<GamblingChipIcon />}
      title={
        <Translate
          pt="Apostas"
          en="Bets"
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
      duration={5}
    >
      <Surface>
        <Translate
          pt="Distribua seus pontos de acordo com a opinião do esquiador"
          en="Distribute your points according to skier"
        />
      </Surface>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={ESQUIADORES_PHASES.BETS}
    >
      <SnowEffect />
      <StepSwitcher
        step={step}
        players={players}
        waitingRoom={{
          content: !isUserSkier && (
            <CurrentBets
              user={user}
              lodges={state.lodges}
              betType="initial"
            />
          ),
        }}
      >
        {/* Step 0 */}
        <RoundAnnouncement
          round={state.round}
          time={5}
          onPressButton={goToNextStep}
        >
          <PlayersTurnOrder
            players={players}
            order={state.turnOrder}
            activePlayerId={state.activeSkierId}
          />
        </RoundAnnouncement>

        {/* Step 1 */}
        <Fragment>
          <ViewIf condition={isUserSkier}>
            <StepMakeChoices
              announcement={announcement}
              players={players}
              turnOrder={state.turnOrder}
              user={user}
              mountain={state.mountain}
              onSubmitChoices={onSubmitChoices}
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
              betType="initial"
              animateFrom={state.animateFrom}
              animateTo={state.animateTo}
              catchUp={state.catchUp}
            />
          </ViewIf>
        </Fragment>
      </StepSwitcher>
    </PhaseContainer>
  );
}
