import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Hooks
import { useAPICall, useLanguage, useWhichPlayerIsThe, useIsUserThe } from '../../hooks';
// Resources & Utils
import { POLEMICA_DA_VEZ_API } from '../../adapters';
import { PHASES } from '../../utils/constants';
// Components
import {
  DefaultWaitingRoom,
  Instruction,
  PhaseAnnouncement,
  PhaseContainer,
  RoundAnnouncement,
  Step,
  StepSwitcher,
  Translate,
  translate,
  ViewIf,
  WaitingRoom,
} from '../../components/shared';
import { AvatarName } from '../../components/avatars';
import TopicSelectionStep from './TopicSelectionStep';

function PhaseTopicSelection({ state, players, info }) {
  const language = useLanguage();
  const activePlayer = useWhichPlayerIsThe('activePlayer', state, players);
  const isUserTheActivePlayer = useIsUserThe('activePlayer', state);
  const [step, setStep] = useState(0);

  const onSubmitTopicAPIRequest = useAPICall({
    apiFunction: POLEMICA_DA_VEZ_API.submitAction,
    actionName: 'submit-topic',
    onBeforeCall: () => setStep(3),
    onError: () => setStep(2),
    successMessage: translate('Assunto enviada com sucesso!', 'Topic send successfully!', language),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar seu assunto',
      'Oops, the application failed to submit the topic',
      language
    ),
  });

  const onSubmitTopic = (payload) => {
    onSubmitTopicAPIRequest({
      action: 'SUBMIT_TOPIC',
      ...payload,
    });
  };

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.POLEMICA_DA_VEZ.TOPIC_SELECTION}
      className="p-phase"
    >
      <StepSwitcher step={step}>
        {/* Step 0 */}
        <RoundAnnouncement round={state.round} onPressButton={() => setStep(1)} time={4}>
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
          title={translate('Qual a polêmica da vez?', "What's trending now?", language)}
          onClose={() => setStep(2)}
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
                    <AvatarName player={activePlayer} /> escolherá o assunto para essa rodada.
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
                    <AvatarName player={activePlayer} /> will choose the topic for this round.
                  </Instruction>
                </>
              }
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 2 */}
        <Step fullWidth>
          <ViewIf isVisible={isUserTheActivePlayer}>
            <TopicSelectionStep
              currentTopics={state.currentTopics}
              currentCustomTopic={state.currentCustomTopic}
              onSubmitTopic={onSubmitTopic}
            />
          </ViewIf>

          <ViewIf isVisible={!isUserTheActivePlayer}>
            <WaitingRoom
              title={translate('Aguarde...', 'Please wait...', language)}
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

        {/* Step 3 */}
        <Step fullWidth>
          <DefaultWaitingRoom players={players} />
        </Step>
      </StepSwitcher>
    </PhaseContainer>
  );
}

PhaseTopicSelection.propTypes = {
  info: PropTypes.object,
  players: PropTypes.object,
  state: PropTypes.shape({
    phase: PropTypes.string,
    round: PropTypes.shape({
      current: PropTypes.number,
      total: PropTypes.number,
    }),
  }),
};

export default PhaseTopicSelection;
