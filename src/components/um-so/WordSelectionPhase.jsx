import React, { Fragment, useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { message, notification } from 'antd';
// Hooks
import { useGlobalState } from '../../hooks';
import { useLoading } from '../../hooks';
// Resources & Utils
import { UM_SO_PHASES } from '../../utils/constants';
// Components
import Avatar from '../avatars/Avatar';
import PhaseContainer from '../shared/PhaseContainer';
import RoundAnnouncement from '../shared/RoundAnnouncement';
import Instruction from '../shared/Instruction';
import WaitingRoom from '../shared/WaitingRoom';
import StepSwitcher from '../shared/StepSwitcher';
import WordSelectionStep from './WordSelectionStep';
import { UM_SO_API } from '../../adapters';

function WordSelectionPhase({ state, players, info }) {
  const [, setLoader] = useLoading();
  const [gameId] = useGlobalState('gameId');
  const [gameName] = useGlobalState('gameName');
  const [me] = useGlobalState('me');
  const [step, setStep] = useState(0);
  const [amIReady, setImReady] = useState(false);
  const [guesser, setGuesser] = useState(players[state.guesser]);
  const [amItheGuesser, setAmITheGuesser] = useState(false);

  useEffect(() => {
    setGuesser(players[state.guesser]);
    setAmITheGuesser(state.guesser === me);
  }, [state.guesser, me, players]);

  const onSendSelectedWords = useCallback(
    async (selectedWords) => {
      try {
        setLoader('submit-drawing', true);
        setStep(2);
        const response = await UM_SO_API.submitWordSelectionVotes({
          gameId,
          gameName,
          playerName: me,
          votes: selectedWords,
        });
        if (response.data) {
          setImReady(true);
          message.success('Acabou o tempo! Aguarde enquanto os outros participantes decidem');
        }
      } catch (e) {
        notification.error({
          message: 'Vixi, o aplicativo encontrou um erro ao tentar enviar seus votos',
          description: JSON.stringify(e),
          placement: 'bottomLeft',
        });
        console.error(e);
      } finally {
        setLoader('submit-drawing', false);
      }
    },
    [gameId, gameName, me, setLoader]
  );

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={UM_SO_PHASES.WORD_SELECTION}
      className="u-word-selection-phase"
    >
      <StepSwitcher step={step} conditions={[!amIReady]}>
        {/* Step 0 */}
        <RoundAnnouncement round={state.round} onPressButton={() => setStep(1)}>
          <Instruction>
            Para essa rodada,
            <span className="u-word-selection-phase__guesser-name-announcement">
              {amItheGuesser ? (
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
        </RoundAnnouncement>

        {/* Step 1 */}
        <Fragment>
          {amItheGuesser ? (
            <WaitingRoom
              players={players}
              title="Você é o(a) adivinhador(a)"
              instruction="Aguarde os outros jogadores decidirem a palavra secreta."
            />
          ) : (
            <WordSelectionStep words={state?.words} onSendSelectedWords={onSendSelectedWords} />
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
