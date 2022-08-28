// State & Hooks
import { useIsUserReady } from 'hooks/useIsUserReady';
import { useLanguage } from 'hooks/useLanguage';
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
import { useOnSubmitWordAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { GeneralRules, WordSelectionRules } from './components/RulesBlobs';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { RoundAnnouncement } from 'components/round';
import { Instruction } from 'components/text';
import { Translate } from 'components/language';
import { ViewOr } from 'components/views';
import { WaitingRoom } from 'components/players';
import { AvatarName } from 'components/avatars';
import { StepWordSelection } from './StepWordSelection';
import { SleepIcon } from 'components/icons/SleepIcon';

function PhaseWordSelection({ players, state, info }: PhaseProps) {
  const { translate } = useLanguage();
  const { step, goToNextStep, setStep } = useStep();
  const isUserReady = useIsUserReady(players, state);
  const [scout, isUserTheScout] = useWhichPlayerIsThe('scoutId', state, players);

  const onSubmitWord = useOnSubmitWordAPIRequest(setStep);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.GALERIA_DE_SONHOS.WORD_SELECTION}>
      <StepSwitcher
        step={step}
        conditions={[!isUserReady, !isUserReady, !isUserReady]}
        players={players}
        waitingRoomInstructionType="SERVER"
      >
        {/* Step 0 */}
        <RoundAnnouncement round={state?.round} onPressButton={goToNextStep} buttonText=" " time={5}>
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
          title={translate('Tema dos Sonhos', 'The Dream Theme')}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
        >
          <WordSelectionRules scout={scout} />
        </PhaseAnnouncement>

        {/* Step 2 */}
        <ViewOr orCondition={isUserTheScout}>
          <StepWordSelection onSubmitWord={onSubmitWord} words={state.words} />

          <WaitingRoom
            players={players}
            title={<Translate pt="Aguarde..." en="Please wait..." />}
            instruction={
              <Translate
                pt={
                  <>
                    <AvatarName player={scout} /> está escolhendo o tema.
                  </>
                }
                en={
                  <>
                    <AvatarName player={scout} /> is choosing the theme.
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

export default PhaseWordSelection;
