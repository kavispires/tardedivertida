// Ant Design Resources
import { Flex } from 'antd';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
// Icons
import { BooksIcon } from 'icons/BooksIcon';
// Components
import { BookPatternCard } from 'components/cards/BookPatternCard';
import { Translate } from 'components/language/Translate';
import { PhaseAnnouncement } from 'components/phases/PhaseAnnouncement';
import { PhaseContainer } from 'components/phases/PhaseContainer';
import { RoundAnnouncement } from 'components/round/RoundAnnouncement';
import { StepSwitcher } from 'components/steps/StepSwitcher';
import { Instruction } from 'components/text/Instruction';
import { TextHighlight } from 'components/text/TextHighlight';
// Internal
import type { PhasePatternCreationState } from './utils/types';
import { SENSO_LITERARIO_PHASES } from './utils/constants';
import { useOnSubmitPatternAPIRequest } from './utils/api-requests';
import { StepCreatePattern } from './StepCreatePattern';

export function PhasePatternCreation({ players, state, user }: PhaseProps<PhasePatternCreationState>) {
  const { step, goToNextStep, setStep } = useStep();
  const onSubmitPattern = useOnSubmitPatternAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<BooksIcon />}
      title={
        <Translate
          pt={
            <>
              Qual livro vai no lugar do <TextHighlight>?</TextHighlight> ?
            </>
          }
          en={
            <>
              Which book goes in the <TextHighlight>?</TextHighlight> spot?
            </>
          }
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Instruction>
        <Translate
          pt={<>Use seu senso comum para desvendar qual a livro obedece a sequência</>}
          en={<>Use your common sense to figure out which book follows the sequence</>}
        />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={SENSO_LITERARIO_PHASES.PATTERN_CREATION}
    >
      <StepSwitcher
        step={step}
        players={players}
        waitingRoom={{
          content: (
            <Flex justify="center">
              <BookPatternCard
                patternId={user?.patternId || 'wildcard'}
                cardWidth={84}
              />
            </Flex>
          ),
        }}
      >
        {/* Step 0 */}
        <RoundAnnouncement
          round={state.round}
          onPressButton={goToNextStep}
          time={5}
        />

        {/* Step 1 */}
        <StepCreatePattern
          user={user}
          players={players}
          announcement={announcement}
          sequence={state.sequence}
          onSubmitPattern={onSubmitPattern}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
