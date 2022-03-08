// Hooks
import { useLanguage, useStep, useWhichPlayerIsThe } from 'hooks';
import { useOnSubmitTopicAPIRequest } from './api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import {
  AvatarName,
  Instruction,
  PhaseAnnouncement,
  PhaseContainer,
  RoundAnnouncement,
  Step,
  StepSwitcher,
  Translate,
  ViewIf,
  WaitingRoom,
} from 'components';
import { StepTopicSelection } from './StepTopicSelection';

function PhaseTopicSelection({ state, players, info }: PhaseProps) {
  const { translate } = useLanguage();
  const { step, goToNextStep, setStep } = useStep(0);
  const [activePlayer, isUserTheActivePlayer] = useWhichPlayerIsThe('activePlayerId', state, players);

  const onSubmitTopic = useOnSubmitTopicAPIRequest(setStep);

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
                  curtidas o assunto vai ganhar. Se você adivinhar corretamente, você ganha 1 ponto.
                  <br />
                  O primeiro jogador a receber 4 pontos ganha o jogo (ou no máximo 15 rodadas)
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
                  The first player to get 4 points wins the game (or a maximum of 15 rounds)
                  <br />
                  <Instruction contained>
                    <AvatarName player={activePlayer} addressUser /> will choose the topic for this round.
                  </Instruction>
                </>
              }
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 2 */}
        <Step fullWidth>
          <ViewIf isVisible={isUserTheActivePlayer}>
            <StepTopicSelection
              currentTopics={state.currentTopics}
              currentCustomTopic={state.currentCustomTopic}
              onSubmitTopic={onSubmitTopic}
            />
          </ViewIf>

          <ViewIf isVisible={!isUserTheActivePlayer}>
            <WaitingRoom
              title={translate('Aguarde...', 'Please wait...')}
              instruction={
                <>
                  <AvatarName player={activePlayer} addressUser />{' '}
                  <Translate
                    pt="está escolhendo a polêmica da rodada."
                    en="is choosing the topic for the round."
                  />
                </>
              }
              players={players}
            />
          </ViewIf>
        </Step>
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseTopicSelection;
