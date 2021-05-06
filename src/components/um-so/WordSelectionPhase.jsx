import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Button, Typography } from 'antd';
// Hooks
import { useGlobalState } from '../../hooks';
// Resources & Utils
import { UM_SO_PHASES } from '../../utils/constants';
// Components
import Avatar from '../avatars/Avatar';
import PhaseContainer from '../shared/PhaseContainer';
import RoundAnnouncement from '../shared/RoundAnnouncement';
import Instruction from '../shared/Instruction';
import WaitingRoom from '../shared/WaitingRoom';
import StepSwitcher from '../shared/StepSwitcher';

function WordSelectionPhase({ state, players, info }) {
  const [me] = useGlobalState('me');
  const [step, setStep] = useState(0);
  const [amIReady, setImReady] = useState(false);
  const [guesser, setGuesser] = useState(players[state.guesser]);
  const [amItheGuesser, setAmITheGuesser] = useState(false);

  useEffect(() => {
    console.log('HERE');
    setGuesser(players[state.guesser]);
    setAmITheGuesser(state.guesser === me);
  }, [state.guesser, me, players]);

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
            <div className="">
              <div>Aqui vem a seleção de palavras</div>
            </div>
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
