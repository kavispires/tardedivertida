import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { message, Progress } from 'antd';
// Hooks
import { useIsUserReady, useIsUserThe, useActivePlayer, useAPICall } from '../../../hooks';
// Resources & Utils
import { UE_SO_ISSO_API } from '../../../adapters';
import { PHASES } from '../../../utils/constants';
// Components
import Avatar from '../../avatars/Avatar';
import PhaseContainer from '../../shared/PhaseContainer';
import RoundAnnouncement from '../../shared/RoundAnnouncement';
import Instruction from '../../shared/Instruction';
import WaitingRoom from '../../shared/WaitingRoom';
import StepSwitcher from '../../shared/StepSwitcher';
import WordSelectionStep from './WordSelectionStep';

function WordSelectionPhase({ state, players, info }) {
  const amIReady = useIsUserReady(players, state);
  const guesser = useActivePlayer(state, players, 'guesser');
  const isUserTheGuesser = useIsUserThe('guesser', state);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step === 0 && state.previousSecretWord?.text) {
      message.info(`A palavra secreta anterior era: ${state.previousSecretWord.text}`, 5);
    }
  }, [step, state?.previousSecretWord.text]);

  const onSendSelectedWords = useAPICall({
    apiFunction: UE_SO_ISSO_API.submitWordSelectionVotes,
    actionName: 'submit-votes',
    onBeforeCall: () => setStep(2),
    onError: () => setStep(0),
    successMessage: 'Acabou o tempo! Aguarde enquanto os outros participantes votam',
    errorMessage: 'Vixi, o aplicativo encontrou um erro ao tentar enviar seus votos',
  });

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.UE_SO_ISSO.WORD_SELECTION}
      className="u-word-selection-phase"
    >
      <StepSwitcher step={step} conditions={[!amIReady]}>
        {/* Step 0 */}
        <RoundAnnouncement round={state.round} onPressButton={() => setStep(1)} time={7}>
          <Instruction contained>
            Para essa rodada,
            <span className="u-word-selection-phase__guesser-name-announcement">
              {isUserTheGuesser ? (
                'VOCÊ'
              ) : (
                <>
                  <Avatar id={guesser.avatarId} /> {guesser.name}
                </>
              )}
            </span>
            será o(a) adivinhador(a) <br />
            {state?.nextGuesser ? `Próximo adivinhador(a): ${state.nextGuesser}` : 'Essa é a última rodada'}
          </Instruction>
          <div className="u-word-selection-phase__team-points">
            Pontos do Grupo:
            <br />
            <Progress
              percent={state.groupScore ?? 0}
              status="active"
              strokeColor={{
                '0%': '#ff0000',
                '70%': '#ff0000',
                '100%': '#87d068',
              }}
            />
          </div>
        </RoundAnnouncement>

        {/* Step 1 */}
        <Fragment>
          {isUserTheGuesser ? (
            <WaitingRoom
              players={players}
              title="Você é o(a) adivinhador(a)"
              instruction="Aguarde os outros jogadores decidirem a palavra secreta."
            />
          ) : (
            <WordSelectionStep
              words={state?.words}
              onSendSelectedWords={onSendSelectedWords}
              guesser={guesser}
            />
          )}
        </Fragment>

        {/* Step 2 */}
        <WaitingRoom players={players} title="Pronto!" instruction="Vamos aguardar os outros joadores." />
      </StepSwitcher>
    </PhaseContainer>
  );
}

WordSelectionPhase.propTypes = {
  info: PropTypes.object,
  players: PropTypes.object,
  state: PropTypes.object,
};

export default WordSelectionPhase;
