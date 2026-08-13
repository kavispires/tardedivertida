// Types
import type { PhaseProps } from 'types/game';
import type { TopicCardData } from 'types/tdr';
// Hooks
import { useStep } from '@hooks/useStep';
// Icons
import { LockIcon } from '@icons/LockIcon';
import { TimedWritingIcon } from '@icons/TimedWritingIcon';
// Components
import { Icon } from '@components/general/Icon';
import { Translate } from '@components/language/Translate';
import { TranslateTemplate } from '@components/language/TranslateTemplate';
import { Surface } from '@components/layout/Surface';
import { TimeHighlight } from '@components/metrics/TimeHighlight';
import { PhaseAnnouncement } from '@components/phases/PhaseAnnouncement';
import { PhaseContainer } from '@components/phases/PhaseContainer';
import { RoundAnnouncement } from '@components/round/RoundAnnouncement';
import { StepSwitcher } from '@components/steps/StepSwitcher';
import { TextHighlight } from '@components/text/TextHighlight';
// Internal
import { useOnSubmitAnswersAPIRequest } from './utils/api-requests';
import { ADEDANHX_PHASES, ANSWERING_TIME_IN_MINUTES } from './utils/constants';
import type { PhaseAnsweringState } from './utils/types';
import { StepAnswerGrid } from './StepAnswerGrid';

export function PhaseAnswering({ players, state, user }: PhaseProps<PhaseAnsweringState>) {
  const { step, goToNextStep, setStep } = useStep();

  const onSubmitAnswers = useOnSubmitAnswersAPIRequest(setStep);

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={ADEDANHX_PHASES.ANSWERING}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <RoundAnnouncement
          round={state?.round}
          onPressButton={goToNextStep}
          buttonText=" "
          time={state?.round?.current === 1 ? 10 : 5}
          unskippable
        >
          <Surface contained>
            <TranslateTemplate
              en="You have <time>minutes</time> to fill in as many cells of the table as possible by combining column and row.<br />For each cell you complete, remember to press the {lockIcon} lock to record the time."
              pt="Você tem <time>minutos</time> para preencher o maior número de células da tabela combinando coluna e linha.<br />A cada célula que você completa, lembre-se de apertar o {lockIcon} cadeado para gravar o tempo."
              values={{
                time: (content) => (
                  <TimeHighlight>
                    {ANSWERING_TIME_IN_MINUTES} {content}
                  </TimeHighlight>
                ),
                lockIcon: (
                  <Icon
                    size="small"
                    icon={<LockIcon />}
                  />
                ),
              }}
            />
          </Surface>
        </RoundAnnouncement>

        {/* Step 1 */}
        <PhaseAnnouncement
          icon={<TimedWritingIcon />}
          title={
            <Translate
              pt="Adedanhe!"
              en="Write!!!"
            />
          }
          currentRound={state?.round?.current}
          type="block"
          onClose={goToNextStep}
          duration={state.grid.xHeaders.length * 4}
          unskippable
        >
          <Surface>
            <TranslateTemplate
              en="The round categories are {categories}.<br />You get bonus points if you are the first to answer a cell! Good luck!"
              pt="As categorias da rodada são {categories}.<br />Você ganha pontos bônus se você for o primeiro a responder uma célula! Boa sorte!"
              values={{
                categories: state.grid.xHeaders.map((c: TopicCardData) => (
                  <TextHighlight
                    dark
                    key={c.label}
                  >
                    {c.label}
                  </TextHighlight>
                )),
              }}
            />
          </Surface>
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
