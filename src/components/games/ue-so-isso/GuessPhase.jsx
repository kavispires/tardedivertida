import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
// Design Resources
import { Button, Space } from 'antd';
import { CheckOutlined, CloseOutlined, QuestionCircleOutlined } from '@ant-design/icons';
// Hooks
import { useGlobalState, useLoading, useActivePlayer, useIsUserThe, useAPICall } from '../../../hooks';
// Resources & Utils
import { UE_SO_ISSO_API } from '../../../adapters';
import { PHASES } from '../../../utils/constants';
// Components
import PhaseContainer from '../../shared/PhaseContainer';
import WaitingRoom from '../../shared/WaitingRoom';
import StepSwitcher, { Step } from '../../shared/StepSwitcher';
import Title from '../../shared/Title';
import Avatar from '../../avatars/Avatar';
import Instruction from '../../shared/Instruction';
import UeSoIssoCard from '../../cards/UeSoIssoCard';
import SuggestionCard from './SuggestionCard';
import Guess from './Guess';

function GuessPhase({ state, players, info }) {
  const [isLoading] = useLoading();
  const [isAdmin] = useGlobalState('isAdmin');
  const [step, setStep] = useState(0);
  const guesser = useActivePlayer(state, players, 'guesser');
  const isUserTheNextGuesser = useIsUserThe('nextGuesser', state);
  const isUserTheGuesser = useIsUserThe('guesser', state);

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
        <Step>
          <Title>
            {state.guess ? (
              <span>
                <Avatar id={guesser.avatarId} /> {guesser.name} disse "{state.guess}"
              </span>
            ) : (
              <span>
                Hora de brilhar <Avatar id={guesser.avatarId} /> {guesser.name}!
              </span>
            )}
          </Title>
          <Instruction contained>
            {isUserTheGuesser ? 'Você' : guesser.name} tem uma única change de adivinhar a palavra secreta!
          </Instruction>

          <UeSoIssoCard
            word={isUserTheGuesser && !state.guess ? <QuestionCircleOutlined /> : state.secretWord.text}
            header="A Palavra Secreta é"
          />

          {state.guess ? (
            <Instruction contained>
              {state.nextGuesser} está encarregado(a) de apertar os botões se você acertou ou não. <br />
              São 3 pontos se você acertar, -1 se errar, mas você pode passar e não tentar, covarde!.. <br />
              As dicas são:
            </Instruction>
          ) : (
            <Instruction contained>
              {isUserTheGuesser ? (
                <span>Escreva seu chute no campo abaixo</span>
              ) : (
                <span>{guesser.name} está pensando...</span>
              )}
            </Instruction>
          )}

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

          {isUserTheGuesser && !state.guess && <Guess onSubmitGuess={onSubmitGuess} />}

          {state.guess && (isUserTheNextGuesser || isAdmin) && (
            <Space className={clsx('u-word-guess-phase__guess-submit', isAdmin && 'admin-container')}>
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
            </Space>
          )}
        </Step>

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
