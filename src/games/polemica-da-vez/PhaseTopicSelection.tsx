// Hooks
import { useMock } from 'hooks/useMock';
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
import { useOnSubmitTopicAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
import { mockTopicSelection } from './utils/mock';
// Components
import { StepTopicSelection } from './StepTopicSelection';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { Step, StepSwitcher } from 'components/steps';
import { RoundAnnouncement } from 'components/round';
import { Instruction } from 'components/text';
import { Translate } from 'components/language';
import { AvatarName } from 'components/avatars';
import { ViewOr } from 'components/views';
import { TurnOrder, WaitingRoom } from 'components/players';
import { TrendingIcon } from 'components/icons/TrendingIcon';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
import { TargetHighlight } from 'components/metrics/TargetHighlight';

function PhaseTopicSelection({ state, players, info, meta }: PhaseProps) {
  const { step, goToNextStep, setStep } = useStep(0);
  const [activePlayer, isUserTheActivePlayer] = useWhichPlayerIsThe('activePlayerId', state, players);

  const onSubmitTopic = useOnSubmitTopicAPIRequest(setStep);
  const isFixedRounds = Boolean(meta?.options?.fixedRounds);

  useMock(() => {
    if (step === 1 && isUserTheActivePlayer) {
      onSubmitTopic(mockTopicSelection(state.currentTopics));
    }
  }, [step]);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.POLEMICA_DA_VEZ.TOPIC_SELECTION}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <RoundAnnouncement
          round={state.round}
          onPressButton={goToNextStep}
          time={4}
          circleColor={info?.appearance?.color}
        >
          <Instruction contained>
            <Translate
              pt="Cada rodada um novo assunto, a sua opinião e a opinião dos outros."
              en="Every round a new topic, your opinion and everybody else's."
            />
          </Instruction>
        </RoundAnnouncement>

        {/* Step 1 */}
        <PhaseAnnouncement
          icon={<TrendingIcon />}
          title={<Translate pt="Você sabe qual a polêmica da vez?" en="Do you know what's trending now?" />}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          duration={state?.round?.current < 3 ? 30 : undefined}
        >
          <Instruction>
            <Translate
              pt={
                <>
                  Todos vão curtir ou des-curtir a polêmica da vez e então devem tentar adivinhar quantas
                  curtidas o assunto vai ganhar. Se você adivinhar corretamente, você ganha{' '}
                  <PointsHighlight>3</PointsHighlight> pontos.
                  <br />
                  Se você escolheu um número a menos ou a mais, você ganha{' '}
                  <PointsHighlight>1</PointsHighlight> ponto.
                  <br />
                  {isFixedRounds ? (
                    <>O jogo tem {state.round.total} rodadas.</>
                  ) : (
                    <>
                      O primeiro jogador a receber <TargetHighlight>10</TargetHighlight> pontos ganha o jogo
                      (ou no máximo {state.round.total} rodadas)
                    </>
                  )}
                  <br />
                  <Instruction contained>
                    <AvatarName player={activePlayer} addressUser /> escolherá o assunto para essa rodada.
                  </Instruction>
                </>
              }
              en={
                <>
                  All players must like or dislike a topic then must vote how trendy it is (how many players
                  liked the topic). If you guess correctly you get <PointsHighlight>3</PointsHighlight>{' '}
                  points.
                  <br />
                  If you got 1 number off (more or less), you get <PointsHighlight>1</PointsHighlight> point.
                  <br />
                  {isFixedRounds ? (
                    <>
                      The game will have
                      {state.round.total} rounds.
                    </>
                  ) : (
                    <>
                      The first players to get <TargetHighlight>10</TargetHighlight> points wins the game (or
                      a maximum of {state.round.total} rounds)
                    </>
                  )}
                  <br />
                  <Instruction contained>
                    <AvatarName player={activePlayer} addressUser /> will choose the topic for this round.
                  </Instruction>
                </>
              }
            />
            <TurnOrder order={state.gameOrder} players={players} activePlayerId={state.activePlayerId} />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 2 */}
        <ViewOr condition={isUserTheActivePlayer}>
          <StepTopicSelection
            currentTopics={state.currentTopics}
            currentCustomTopic={state.currentCustomTopic}
            onSubmitTopic={onSubmitTopic}
          />

          <Step fullWidth>
            <WaitingRoom
              title={<Translate pt="Aguarde..." en="Please wait..." />}
              instruction={
                <>
                  <AvatarName player={activePlayer} addressUser />{' '}
                  <Translate
                    pt="está escolhendo a polêmica da rodada."
                    en="is choosing the topic for the round."
                  />
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

export default PhaseTopicSelection;
