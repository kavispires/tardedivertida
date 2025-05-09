// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useMock } from 'hooks/useMock';
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { TrendingIcon } from 'icons/TrendingIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { TurnOrder, WaitingRoom } from 'components/players';
import { RoundAnnouncement } from 'components/round';
import { Step, StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { ViewOr } from 'components/views';
// Internal
import { useOnSubmitTweetAPIRequest } from './utils/api-requests';
import { mockTweetSelection } from './utils/mock';
import { POLEMICA_DA_VEZ_PHASES } from './utils/constants';
import { ScoringRules } from './components/RulesBlobs';
import { StepTweetSelection } from './StepTweetSelection';

export function PhaseTweetSelection({ state, players, meta }: PhaseProps) {
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
      title={<Translate pt="Você sabe qual a polêmica da vez?" en="Do you know what's trending now?" />}
      currentRound={state?.round?.current}
      duration={state?.round?.current < 3 ? 30 : undefined}
      type="overlay"
    >
      <Instruction>
        <ScoringRules round={state.round} activePlayer={activePlayer} isFixedRounds={isFixedRounds} />
        <TurnOrder order={state.gameOrder} players={players} activePlayerId={state.activePlayerId} />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={POLEMICA_DA_VEZ_PHASES.TOPIC_SELECTION}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <RoundAnnouncement round={state.round} onPressButton={goToNextStep} time={4}>
          <Instruction contained>
            <Translate
              pt="Cada rodada um novo assunto, a sua opinião e a opinião dos outros."
              en="Every round a new tweet, your opinion and everybody else's."
            />
          </Instruction>
        </RoundAnnouncement>

        {/* Step 1 */}
        <ViewOr condition={isUserTheActivePlayer}>
          <StepTweetSelection
            currentTweets={state.currentTweets}
            currentCustomTweet={state.currentCustomTweet}
            onSubmitTweet={onSubmitTweet}
            announcement={announcement}
            round={state.round}
            isFixedRounds={isFixedRounds}
          />

          <Step fullWidth announcement={announcement}>
            <WaitingRoom
              title={<Translate pt="Aguarde..." en="Please wait..." />}
              instruction={
                <>
                  <Instruction>
                    <ScoringRules
                      round={state.round}
                      activePlayer={activePlayer}
                      isFixedRounds={isFixedRounds}
                    />
                  </Instruction>
                  <TurnOrder
                    order={state.gameOrder}
                    players={players}
                    activePlayerId={state.activePlayerId}
                  />
                </>
              }
              players={players}
            />
          </Step>
        </ViewOr>
      </StepSwitcher>
    </PhaseContainer>
  );
}
