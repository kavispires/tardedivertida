import { Fragment } from 'react/jsx-runtime';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useMock } from '@hooks/useMock';
import { useStep } from '@hooks/useStep';
import { useWhichPlayerIsThe } from '@hooks/useWhichPlayerIsThe';
// Icons
import { TrendingIcon } from '@icons/TrendingIcon';
// Components
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { PhaseAnnouncement } from '@components/phases/PhaseAnnouncement';
import { PhaseContainer } from '@components/phases/PhaseContainer';
import { PlayersTurnOrder } from '@components/players/PlayersTurnOrder';
import { WaitingRoom } from '@components/players/WaitingRoom';
import { RoundAnnouncement } from '@components/round/RoundAnnouncement';
import { Step } from '@components/steps/Step';
import { StepSwitcher } from '@components/steps/StepSwitcher';
import { ViewIf } from '@components/views/ViewIf';
// Internal
import { useOnSubmitTweetAPIRequest } from './utils/api-requests';
import { mockTweetSelection } from './utils/mock';
import { POLEMICA_DA_VEZ_PHASES } from './utils/constants';
import type { PhaseTweetSelectionState } from './utils/types';
import { ScoringRules } from './components/RulesBlobs';
import { StepTweetSelection } from './StepTweetSelection';

export function PhaseTweetSelection({ state, players, meta }: PhaseProps<PhaseTweetSelectionState>) {
  const { step, goToNextStep, setStep } = useStep(0);
  const [activePlayer, isUserTheActivePlayer] = useWhichPlayerIsThe('activePlayerId', state, players);

  const onSubmitTweet = useOnSubmitTweetAPIRequest(setStep);
  const isFixedRounds = Boolean(meta?.options?.fixedRounds);

  useMock(() => {
    if (step === 1 && isUserTheActivePlayer) {
      onSubmitTweet(mockTweetSelection(state.currentTweets));
    }
  }, [step]);

  const announcement = (
    <PhaseAnnouncement
      icon={<TrendingIcon />}
      title={
        <Translate
          pt="Você sabe qual a polêmica da vez?"
          en="Do you know what's trending now?"
        />
      }
      currentRound={state?.round?.current}
      duration={state?.round?.current < 3 ? 30 : undefined}
      type="overlay"
    >
      <Surface>
        <ScoringRules
          round={state.round}
          activePlayer={activePlayer}
          isFixedRounds={isFixedRounds}
        />
        <PlayersTurnOrder
          order={state.gameOrder}
          players={players}
          activePlayerId={state.activePlayerId}
        />
      </Surface>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={POLEMICA_DA_VEZ_PHASES.TOPIC_SELECTION}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <RoundAnnouncement
          round={state.round}
          onPressButton={goToNextStep}
          time={4}
        >
          <Surface contained>
            <Translate
              pt="Cada rodada um novo assunto, a sua opinião e a opinião dos outros."
              en="Every round a new tweet, your opinion and everybody else's."
            />
          </Surface>
        </RoundAnnouncement>

        {/* Step 1 */}
        <Fragment>
          <ViewIf condition={isUserTheActivePlayer}>
            <StepTweetSelection
              currentTweets={state.currentTweets}
              currentCustomTweet={state.currentCustomTweet}
              onSubmitTweet={onSubmitTweet}
              announcement={announcement}
              round={state.round}
              isFixedRounds={isFixedRounds}
            />
          </ViewIf>
          <ViewIf condition={!isUserTheActivePlayer}>
            <Step
              fullWidth
              announcement={announcement}
            >
              <WaitingRoom
                title={
                  <Translate
                    pt="Aguarde..."
                    en="Please wait..."
                  />
                }
                instruction={
                  <>
                    <Surface>
                      <ScoringRules
                        round={state.round}
                        activePlayer={activePlayer}
                        isFixedRounds={isFixedRounds}
                      />
                    </Surface>
                    <PlayersTurnOrder
                      order={state.gameOrder}
                      players={players}
                      activePlayerId={state.activePlayerId}
                    />
                  </>
                }
                players={players}
              />
            </Step>
          </ViewIf>
        </Fragment>
      </StepSwitcher>
    </PhaseContainer>
  );
}
