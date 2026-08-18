import { Fragment } from 'react/jsx-runtime';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from '@hooks/useStep';
import { useWhichPlayerIsThe } from '@hooks/useWhichPlayerIsThe';
// Icons
import { SleepIcon } from '@icons/SleepIcon';
// Components
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { PhaseAnnouncement } from '@components/phases/PhaseAnnouncement';
import { PhaseContainer } from '@components/phases/PhaseContainer';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
import { WaitingRoom } from '@components/players/WaitingRoom';
import { RoundAnnouncement } from '@components/round/RoundAnnouncement';
import { StepSwitcher } from '@components/steps/StepSwitcher';
import { ViewIf } from '@components/views/ViewIf';
// Internal
import { useOnSubmitWordAPIRequest } from './utils/api-requests';
import { GALERIA_DE_SONHOS_PHASES } from './utils/constants';
import type { PhaseWordSelectionState } from './utils/types';
import { GeneralRules, WordSelectionRules } from './components/RulesBlobs';
import { StepWordSelection } from './StepWordSelection';

export function PhaseWordSelection({ state, players }: PhaseProps<PhaseWordSelectionState>) {
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
          <Surface contained>
            <Translate
              pt="Somos caçadores de sonhos tentando encontrar uns aos outros..."
              en="We're dream scouts trying to find each other..."
            />
          </Surface>
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
        <Fragment>
          <ViewIf condition={isUserTheScout}>
            <StepWordSelection
              onSubmitWord={onSubmitWord}
              words={state.words}
            />
          </ViewIf>
          <ViewIf condition={!isUserTheScout}>
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
                  pt="{scout} está escolhendo o tema."
                  en="{scout} is choosing the theme."
                  values={{ scout: <PlayerAvatarName player={scout} /> }}
                />
              }
            >
              <GeneralRules />
            </WaitingRoom>
          </ViewIf>
        </Fragment>
      </StepSwitcher>
    </PhaseContainer>
  );
}
