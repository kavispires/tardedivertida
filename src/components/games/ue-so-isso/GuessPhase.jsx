import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Button, Space } from 'antd';
import { CheckOutlined, CloseOutlined, MinusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
// Hooks
import { useGlobalState, useLoading, useActivePlayer, useAmIActive, useAPICall } from '../../../hooks';
// Resources & Utils
import { UE_SO_ISSO_API } from '../../../adapters';
import { PHASES } from '../../../utils/constants';
// Components
import PhaseContainer from '../../shared/PhaseContainer';
import WaitingRoom from '../../shared/WaitingRoom';
import StepSwitcher from '../../shared/StepSwitcher';
import Title from '../../shared/Title';
import Avatar from '../../avatars/Avatar';
import Instruction from '../../shared/Instruction';
import UeSoIssoCard from '../../cards/UeSoIssoCard';
import SuggestionCard from './SuggestionCard';

function GuessPhase({ state, players, info }) {
  const [isLoading] = useLoading();
  const [isAdmin] = useGlobalState('isAdmin');
  const [step, setStep] = useState(0);
  const guesser = useActivePlayer(state, players, 'guesser');
  const amITheNextGuesser = useAmIActive(state, 'nextGuesser');

  const onSubmitGuess = useAPICall({
    apiFunction: UE_SO_ISSO_API.confirmGuess,
    actionName: 'guess',
    onBeforeCall: () => setStep(1),
    onError: () => setStep(0),
    successMessage: 'Resultado enviado com sucesso!',
    errorMessage: 'Vixi, o aplicativo encontrou um erro ao tentar enviar o resultado',
  });

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.UE_SO_ISSO.GUESS}
      className="u-word-guess-phase"
    >
      <StepSwitcher step={step}>
        {/* Step 0 */}
        <div className="u-word-guess-phase__step">
          <Title>
            Hora de brilhar <Avatar id={guesser.avatarId} /> {guesser.name}!
          </Title>
          <Instruction contained>Você tem uma única change de adivinhar a palavra secreta!</Instruction>
          <UeSoIssoCard word={<QuestionCircleOutlined />} header="A Palavra Secreta é" />
          <Instruction contained>
            {state.nextGuesser} está encarregado(a) de apertar os botões se você acertou ou não. <br />
            São 3 pontos se você acertar, -1 se errar, mas você pode passar e não tentar, covarde!.. <br />
            As dicas são:
          </Instruction>

          <Space className="u-word-guess-phase__suggestions">
            {state.validSuggestions.map((suggestionEntry, index) => {
              return (
                <div key={`${suggestionEntry.suggestion}-${index}`}>
                  <SuggestionCard
                    suggestion={suggestionEntry.suggestion}
                    invalid={false}
                    avatarId={players[suggestionEntry.playerName].avatarId}
                    index={index}
                  />
                </div>
              );
            })}
          </Space>

          {(amITheNextGuesser || isAdmin) && (
            <Space className="u-word-guess-phase__guess-submit">
              <Button
                icon={<CheckOutlined />}
                type="primary"
                style={{ backgroundColor: 'green' }}
                onClick={() => onSubmitGuess({ guess: 'CORRECT' })}
                disabled={isLoading}
              >
                Acertou
              </Button>
              <Button
                icon={<CloseOutlined />}
                type="primary"
                danger
                onClick={() => onSubmitGuess({ guess: 'WRONG' })}
                disabled={isLoading}
              >
                Errou
              </Button>
              <Button
                icon={<MinusOutlined />}
                type="default"
                onClick={() => onSubmitGuess({ guess: 'PASS' })}
                disabled={isLoading}
              >
                Passou a vez
              </Button>
            </Space>
          )}
        </div>

        {/* Step 1 */}
        <WaitingRoom players={players} title="Enviando a confirmação de sugestões" instruction="Aguarde..." />
      </StepSwitcher>
    </PhaseContainer>
  );
}

GuessPhase.propTypes = {
  info: PropTypes.object,
  players: PropTypes.object,
  state: PropTypes.object,
};

export default GuessPhase;
