import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Progress } from 'antd';
// Hooks
import { useIsUserReady, useIsUserThe, useWhichPlayerIsThe, useAPICall } from '../../../hooks';
// Resources & Utils
import { UE_SO_ISSO_API } from '../../../adapters';
import { PHASES } from '../../../utils/constants';
// Components
import PhaseContainer from '../../shared/PhaseContainer';
import RoundAnnouncement from '../../shared/RoundAnnouncement';
import Instruction from '../../shared/Instruction';
import WaitingRoom from '../../shared/WaitingRoom';
import StepSwitcher, { Step } from '../../shared/StepSwitcher';
import WordSelectionStep from './WordSelectionStep';
import AvatarName from '../../avatars/AvatarName';
import { View } from '../../shared/View';

function WordSelectionPhase({ state, players, info }) {
  const isUserReady = useIsUserReady(players, state);
  const guesser = useWhichPlayerIsThe('guesser', state, players);
  const isUserTheGuesser = useIsUserThe('guesser', state);
  const [step, setStep] = useState(0);

  const onSendSelectedWords = useAPICall({
    apiFunction: UE_SO_ISSO_API.submitWordSelectionVotes,
    actionName: 'submit-votes',
    onBeforeCall: () => setStep(2),
    onError: () => setStep(0),
    successMessage: 'Aguarde enquanto os outros participantes votam',
    errorMessage: 'Vixi, o aplicativo encontrou um erro ao tentar enviar seus votos',
  });

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.UE_SO_ISSO.WORD_SELECTION}
      className="u-word-selection-phase"
    >
      <StepSwitcher step={step} conditions={[!isUserReady]}>
        {/* Step 0 */}
        <RoundAnnouncement round={state.round} onPressButton={() => setStep(1)} time={7}>
          <Instruction contained>
            Para essa rodada, <AvatarName player={guesser} addressUser /> será o(a) adivinhador(a) <br />
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
        <Step fullWidth>
          <View visibleIf={isUserTheGuesser}>
            <WaitingRoom
              players={players}
              title="Você é o(a) adivinhador(a)"
              instruction="Aguarde os outros jogadores decidirem a palavra secreta."
            />
          </View>

          <View visibleIf={!isUserTheGuesser}>
            <WordSelectionStep
              words={state?.words}
              onSendSelectedWords={onSendSelectedWords}
              guesser={guesser}
            />
          </View>
        </Step>

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
