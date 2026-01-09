// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { SleepIcon } from 'icons/SleepIcon';
// Components
import { PlayerAvatarName } from 'components/avatars';
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { WaitingRoom } from 'components/players';
import { RoundAnnouncement } from 'components/round';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { ViewOr } from 'components/views';
// Internal
import { useOnSubmitWordAPIRequest } from './utils/api-requests';
import { GALERIA_DE_SONHOS_PHASES } from './utils/constants';
import { GeneralRules, WordSelectionRules } from './components/RulesBlobs';
import { StepWordSelection } from './StepWordSelection';

export function PhaseWordSelection({ state, players }: PhaseProps) {
  const { step, goToNextStep, setStep } = useStep();

  const [scout, isUserTheScout] = useWhichPlayerIsThe('scoutId', state, players);

  const onSubmitWord = useOnSubmitWordAPIRequest(setStep);

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={GALERIA_DE_SONHOS_PHASES.WORD_SELECTION}
    >
      <StepSwitcher
        step={step}
        players={players}
        waitingRoom={{ type: 'SERVER' }}
      >
        {/* Step 0 */}
        <RoundAnnouncement
          round={state?.round}
          onPressButton={goToNextStep}
          buttonText=" "
          time={5}
        >
          <Instruction contained>
            <Translate
              pt="Somos caçadores de sonhos tentando encontrar uns aos outros..."
              en="We're dream scouts trying to find each other..."
            />
          </Instruction>
        </RoundAnnouncement>

        {/* Step 1 */}
        <PhaseAnnouncement
          icon={<SleepIcon />}
          title={
            <Translate
              pt="Tema dos Sonhos"
              en="The Dream Theme"
            />
          }
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          type="block"
        >
          <WordSelectionRules scout={scout} />
        </PhaseAnnouncement>

        {/* Step 2 */}
        <ViewOr condition={isUserTheScout}>
          <StepWordSelection
            onSubmitWord={onSubmitWord}
            words={state.words}
          />

          <WaitingRoom
            players={players}
            title={
              <Translate
                pt="Aguarde..."
                en="Please wait..."
              />
            }
            instruction={
              <Translate
                pt={
                  <>
                    <PlayerAvatarName player={scout} /> está escolhendo o tema.
                  </>
                }
                en={
                  <>
                    <PlayerAvatarName player={scout} /> is choosing the theme.
                  </>
                }
              />
            }
          >
            <GeneralRules />
          </WaitingRoom>
        </ViewOr>
      </StepSwitcher>
    </PhaseContainer>
  );
}
