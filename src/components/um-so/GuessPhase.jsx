import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Button, message, notification, Space } from 'antd';
import { CheckOutlined, CloseOutlined, MinusOutlined } from '@ant-design/icons';
// Hooks
import { useGlobalState } from '../../hooks';
import { useLoading } from '../../hooks';
// Resources & Utils
import { UM_SO_API } from '../../adapters';
import { UM_SO_PHASES } from '../../utils/constants';
// Components
import PhaseContainer from '../shared/PhaseContainer';
import WaitingRoom from '../shared/WaitingRoom';
import StepSwitcher from '../shared/StepSwitcher';
import Title from '../shared/Title';
import Avatar from '../avatars/Avatar';
import Instruction from '../shared/Instruction';
import UmSoCard from '../cards/UmSoCard';
import SuggestionCard from './SuggestionCard';

function GuessPhase({ state, players, info }) {
  const [, setLoader] = useLoading();
  const [gameId] = useGlobalState('gameId');
  const [gameName] = useGlobalState('gameName');
  const [me] = useGlobalState('me');
  const [isAdmin] = useGlobalState('isAdmin');
  const [step, setStep] = useState(0);
  const [guesser, setGuesser] = useState(players[state.guesser]);
  const [amITheNextGuesser, setAmITheNextGuesser] = useState(false);

  // Determine if user is the guesser
  useEffect(() => {
    setGuesser(players[state.guesser]);
  }, [state.guesser, me, players]);

  useEffect(() => {
    setAmITheNextGuesser(state.nextGuesser === me);
  }, [state.nextGuesser, me]);

  const onSubmitGuess = useCallback(
    async (result) => {
      try {
        setLoader('guess', true);
        setStep(1);
        const response = await UM_SO_API.confirmGuess({
          gameId,
          gameName,
          playerName: me,
          guess: result,
        });

        if (response.data) {
          message.success('Resultado enviado com sucesso!');
        }
      } catch (e) {
        notification.error({
          message: 'Vixi, o aplicativo encontrou um erro ao tentar enviar o resultado',
          description: JSON.stringify(e),
          placement: 'bottomLeft',
        });
        console.error(e);
        setStep(0);
      } finally {
        setLoader('guess', false);
      }
    },
    [gameId, gameName, me, setLoader]
  );

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={UM_SO_PHASES.GUESS}
      className="u-word-guess-phase"
    >
      <StepSwitcher step={step}>
        {/* Step 0 */}
        <div className="u-word-guess-phase__step">
          <Title>
            Hora de brilhar <Avatar id={guesser.avatarId} /> {guesser.name}!
          </Title>
          <Instruction contained>Você tem uma única change de adivinhar a palavra secreta!</Instruction>
          <UmSoCard id={''} />
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
                onClick={() => onSubmitGuess('CORRECT')}
                disabled={false}
              >
                Acertou
              </Button>
              <Button
                icon={<CloseOutlined />}
                type="primary"
                danger
                onClick={() => onSubmitGuess('WRONG')}
                disabled={false}
              >
                Errou
              </Button>
              <Button
                icon={<MinusOutlined />}
                type="default"
                onClick={() => onSubmitGuess('PASS')}
                disabled={false}
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
