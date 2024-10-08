// Types
import type { PhaseProps } from 'types/game';
import type { TopicCard } from 'types/tdr';
// Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
// Utils
import { PHASES } from 'utils/phases';
// Icons
import { LockIcon } from 'icons/LockIcon';
import { TimeWritingIcon } from 'icons/TimedWritingIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { Translate } from 'components/language';
import { TimeHighlight } from 'components/metrics/TimeHighlight';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { RoundAnnouncement } from 'components/round';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { useOnSubmitAnswersAPIRequest } from './utils/api-requests';
import { ANSWERING_TIME_IN_MINUTES } from './utils/constants';
import { StepAnswerGrid } from './StepAnswerGrid';

export function PhaseAnswering({ players, state, info }: PhaseProps) {
  const user = useUser(players, state);
  const { step, goToNextStep, setStep } = useStep();

  const onSubmitAnswers = useOnSubmitAnswersAPIRequest(setStep);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.ADEDANHX.ANSWERING}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <RoundAnnouncement
          round={state?.round}
          onPressButton={goToNextStep}
          buttonText=" "
          time={state?.round?.current === 1 ? 10 : 5}
          circleColor={info?.appearance?.color}
          unskippable
        >
          <Instruction contained>
            <Translate
              pt={
                <>
                  Você tem <TimeHighlight>{ANSWERING_TIME_IN_MINUTES} minutos</TimeHighlight> para preencher o
                  maior número de células da tabela combinando coluna e linha.
                  <br />A cada célula que você completa, lembre-se de apertar o{' '}
                  <IconAvatar size="small" icon={<LockIcon />} /> cadeado para gravar o tempo.
                </>
              }
              en={
                <>
                  You have <TimeHighlight>{ANSWERING_TIME_IN_MINUTES} minutes</TimeHighlight> to fill in as
                  many cells of the table as possible by combining column and row.
                  <br />
                  For each cell you complete, remember to press the{' '}
                  <IconAvatar size="small" icon={<LockIcon />} /> lock to record the time.
                </>
              }
            />
          </Instruction>
        </RoundAnnouncement>

        {/* Step 1 */}
        <PhaseAnnouncement
          icon={<TimeWritingIcon />}
          title={<Translate pt="Adedanhe!" en="Write!!!" />}
          currentRound={state?.round?.current}
          type="block"
          onClose={goToNextStep}
          duration={20}
          unskippable
        >
          <Instruction>
            <Translate
              pt={
                <>
                  As categorias da rodada são{' '}
                  <strong>{state.grid.xHeaders.map((c: TopicCard) => c.label).join(', ')}</strong>.
                  <br />
                  Você ganha pontos bônus se você for o primeiro a responder uma célula! Boa sorte!
                </>
              }
              en={
                <>
                  The round categories are{' '}
                  <strong>{state.grid.xHeaders.map((c: TopicCard) => c.label).join(', ')}</strong>.
                  <br />
                  You get bonus points if you are the first to answer a cell! Good luck!
                </>
              }
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 2 */}
        <StepAnswerGrid
          players={players}
          user={user}
          grid={state.grid}
          onSubmitAnswers={onSubmitAnswers}
          stoppedBy={state.stop}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
