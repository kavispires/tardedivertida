// State & Hooks
import { useUser } from 'hooks/useUser';
import { useStep } from 'hooks/useStep';
import { useOnSubmitAnswersAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Icons
import { TimeWritingIcon } from 'icons/TimedWritingIcon';
import { LockIcon } from 'icons/LockIcon';
// Components
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { Translate } from 'components/language';
import { TimeHighlight } from 'components/metrics/TimeHighlight';
import { IconAvatar } from 'components/avatars';
import { StepAnswerGrid } from './StepAnswerGrid';

export function PhaseAnswering({ players, state, info }: PhaseProps) {
  const user = useUser(players, state);
  const { step, goToNextStep, setStep } = useStep();

  const onSubmitAnswers = useOnSubmitAnswersAPIRequest(setStep);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.ADEDANHX.ANSWERING}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<TimeWritingIcon />}
          title={<Translate pt="Adedanhe!" en="Write!!!" />}
          currentRound={state?.round?.current}
          type="block"
          onClose={goToNextStep}
          duration={15}
          unskippable
        >
          <Instruction>
            <Translate
              pt={
                <>
                  Você tem <TimeHighlight>3 minutos</TimeHighlight> para preencher o maior número de células
                  da tabela combinando coluna e linha.
                  <br />A cada célula que você completa, lembre-se de apertar o{' '}
                  <IconAvatar size="small" icon={<LockIcon />} /> cadeado para gravar o tempo.
                  <br />
                  As categorias são{' '}
                  <strong>{state.grid.xHeaders.map((c: TopicCard) => c.label).join(', ')}</strong>.
                  <br />
                  Você ganha pontos bônus se você for o primeiro a responder uma célula! Boa sorte!
                </>
              }
              en={
                <>
                  You have <TimeHighlight>3 minutes</TimeHighlight> to fill in as many cells of the table as
                  possible by combining column and row.
                  <br />
                  For each cell you complete, remember to press the{' '}
                  <IconAvatar size="small" icon={<LockIcon />} /> lock to record the time.
                  <br />
                  The categories are{' '}
                  <strong>{state.grid.xHeaders.map((c: TopicCard) => c.label).join(', ')}</strong>.
                  <br />
                  You get bonus points if you are the first to answer a cell! Good luck!
                </>
              }
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
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
