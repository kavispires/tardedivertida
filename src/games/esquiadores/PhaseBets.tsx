// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { GamblingChipIcon } from 'icons/GamblingChipIcon';
import { QuestionIcon } from 'icons/QuestionIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { TurnOrder } from 'components/players';
import { RoundAnnouncement } from 'components/round';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { ViewOr } from 'components/views';
// Internal
import type { PhaseBetsState } from './utils/types';
import { useOnSubmitBetsAPIRequest, useOnSubmitChoicesAPIRequest } from './utils/api-requests';
import { ESQUIADORES_PHASES } from './utils/constants';
import { SnowEffect } from './components/SnowEffect';
import { CurrentBets } from './components/CurrentBets';
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
      title={<Translate pt="Responda as perguntas" en="Answer the questions" />}
      currentRound={state?.round?.current}
      type="overlay"
      duration={5}
    >
      <Instruction>
        <Translate pt="Responda as perguntas" en="Answer the questions" />
      </Instruction>
    </PhaseAnnouncement>
  ) : (
    <PhaseAnnouncement
      icon={<GamblingChipIcon />}
      title={<Translate pt="Apostas" en="Bets" />}
      currentRound={state?.round?.current}
      type="overlay"
      duration={5}
    >
      <Instruction>
        <Translate
          pt="Distribua seus pontos de acordo com a opinião do esquiador"
          en="Distribute your points according to skier"
        />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={ESQUIADORES_PHASES.BETS}>
      <SnowEffect />
      <StepSwitcher
        step={step}
        players={players}
        waitingRoom={{
          content: !isUserSkier && <CurrentBets user={user} lodges={state.lodges} betType="initial" />,
        }}
      >
        {/* Step 0 */}
        <RoundAnnouncement round={state.round} time={5} onPressButton={goToNextStep}>
          <TurnOrder players={players} order={state.turnOrder} activePlayerId={state.activeSkierId} />
        </RoundAnnouncement>

        {/* Step 1 */}
        <ViewOr condition={isUserSkier}>
          <StepMakeChoices
            announcement={announcement}
            players={players}
            turnOrder={state.turnOrder}
            user={user}
            mountain={state.mountain}
            onSubmitChoices={onSubmitChoices}
          />

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
        </ViewOr>
      </StepSwitcher>
    </PhaseContainer>
  );
}
