// State & Hooks
import { useIsUserReady, useLanguage, useStep, useWhichPlayerIsThe } from 'hooks';
import { useOnSubmitWordAPIRequest } from './api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import {
  AvatarName,
  Instruction,
  PhaseAnnouncement,
  PhaseContainer,
  RoundAnnouncement,
  StepSwitcher,
  Translate,
  ViewSwitch,
  WaitingRoom,
} from 'components';
import { StepWordSelection } from './StepWordSelection';
import { GeneralRules, WordSelectionRules } from './RulesBlobs';

function PhaseWordSelection({ players, state, info }: PhaseProps) {
  const { translate } = useLanguage();
  const { step, nextStep, setStep } = useStep();
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
        <RoundAnnouncement round={state?.round} onPressButton={nextStep} buttonText=" " time={5}>
          <Instruction contained>
            <Translate
              pt="Somos caçadores de sonhos tentando encontrar uns aos outros..."
              en="We're dream scouts trying to find each other..."
            />
          </Instruction>
        </RoundAnnouncement>

        {/* Step 1 */}
        <PhaseAnnouncement
          type="sleep"
          title={translate('Tema dos Sonhos', 'The Dream Theme')}
          onClose={nextStep}
          currentRound={state?.round?.current}
        >
          <WordSelectionRules scout={scout} />
        </PhaseAnnouncement>

        {/* Step 2 */}
        <ViewSwitch cases={[isUserTheScout, !isUserTheScout]}>
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
        </ViewSwitch>
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseWordSelection;
