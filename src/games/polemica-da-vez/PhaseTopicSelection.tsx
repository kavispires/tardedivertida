// Hooks
import { useLanguage, useMock, useStep, useWhichPlayerIsThe } from 'hooks';
import { useOnSubmitTopicAPIRequest } from './api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
import { mockTopicSelection } from './mock';
// Components
import {
  AvatarName,
  Instruction,
  RoundAnnouncement,
  Step,
  StepSwitcher,
  Translate,
  TurnOrder,
  ViewOr,
  WaitingRoom,
} from 'components';
import { StepTopicSelection } from './StepTopicSelection';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';

function PhaseTopicSelection({ state, players, info, meta }: PhaseProps) {
  const { translate } = useLanguage();
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
        <RoundAnnouncement round={state.round} onPressButton={goToNextStep} time={4} circleColor="blue">
          <Instruction contained>
            <Translate
              pt="Cada rodada um novo assunto, a sua opinião e a opinião dos outros."
              en="Every round a new topic, your opinion and everybody else's."
            />
          </Instruction>
        </RoundAnnouncement>

        {/* Step 1 */}
        <PhaseAnnouncement
          type="trending"
          title={translate('Você sabe qual a polêmica da vez?', "Do you know what's trending now?")}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          duration={state?.round?.current < 3 ? 30 : undefined}
        >
          <Instruction>
            <Translate
              pt={
                <>
                  Todos vão curtir ou descurtir a polêmica da vez e então devem tentar adivinhar quantas
                  curtidas o assunto vai ganhar. Se você adivinhar corretamente, você ganha 3 ponto.
                  <br />
                  Se você escolheu um número a menos ou a mais, você ganha 1 ponto.
                  <br />
                  {isFixedRounds ? (
                    <>O jogo tem {state.round.total} rodadas.</>
                  ) : (
                    <>
                      O primeiro jogador a receber 10 pontos ganha o jogo (ou no máximo {state.round.total}{' '}
                      rodadas)
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
                  liked the topic). If you guess correctly you get 1 point.
                  <br />
                  If you got 1 number off (more or less), you get 1 point.
                  <br />
                  {isFixedRounds ? (
                    <>
                      The game will have
                      {state.round.total} rounds.
                    </>
                  ) : (
                    <>
                      The first players to get 10 points wins the game (or a maximum of {state.round.total}{' '}
                      rounds)
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
        <ViewOr orCondition={isUserTheActivePlayer}>
          <StepTopicSelection
            currentTopics={state.currentTopics}
            currentCustomTopic={state.currentCustomTopic}
            onSubmitTopic={onSubmitTopic}
          />

          <Step fullWidth>
            <WaitingRoom
              title={translate('Aguarde...', 'Please wait...')}
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
