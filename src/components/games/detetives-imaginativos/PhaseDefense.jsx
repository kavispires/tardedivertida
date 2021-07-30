import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Button, message } from 'antd';
// Hooks
import { useIsUserThe, useWhichPlayerIsThe, useAPICall, useLoading, useLanguage } from '../../../hooks';
// Resources & Utils
import { DETETIVES_IMAGINATIVOS_API } from '../../../adapters';
import { PHASES } from '../../../utils/constants';
// Components
import {
  ButtonContainer,
  Instruction,
  PhaseAnnouncement,
  PhaseContainer,
  Step,
  StepSwitcher,
  Title,
  Translate,
  translate,
} from '../../shared';
import { AvatarName } from '../../avatars';
import { messageContent } from '../../modals';
import TableFocus from './TableFocus';

function PhaseDefense({ state, players, info }) {
  const language = useLanguage();
  const [isLoading] = useLoading();
  const currentPlayer = useWhichPlayerIsThe('currentPlayerId', state, players);
  const isUserTheCurrentPlayer = useIsUserThe('currentPlayerId', state);
  const [step, setStep] = useState(0);

  const onFinishDefense = useAPICall({
    apiFunction: DETETIVES_IMAGINATIVOS_API.submitAction,
    actionName: 'submit-secret-clue',
    successMessage: translate('Defesa concluída com sucesso', 'Defense concluded successfully', language),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar concluir sua defesa',
      'Oops, the application found an error while trying to conclude your defense',
      language
    ),
  });

  const onFinishDefenseClick = () => {
    onFinishDefense({
      action: 'DEFEND',
    });
  };

  useEffect(() => {
    if (isUserTheCurrentPlayer && step > 0) {
      message.info(
        messageContent(
          translate('Sua vez de defender suas escolhas!', "It's your turn to defend your choices", language),
          translate(
            'Aperte o botão Concluir Defesa quando terminar',
            "Press the button End Defense when you're done",
            language
          ),

          currentPlayer?.id,
          4
        )
      );
    }
  }, [isUserTheCurrentPlayer, currentPlayer?.id, language, step]);

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.DETETIVES_IMAGINATIVOS.DEFENSE}
      className="d-defense-phase"
    >
      <StepSwitcher step={step}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="defense"
          title={translate('Defensa', 'Defense', language)}
          onClose={() => setStep(1)}
          currentRound={state?.round?.current}
          time={5}
        >
          <Title>
            <Translate pt="Pista Secreta era: " en="The Secret Clue was: " />
            <span className="d-clue">{state.clue}</span>
          </Title>
          <Instruction>
            <Translate
              pt="Agora, cada jogador em ordem deve defender porque escolheu as castas que escolheu."
              en="Now, in turn-order, each player must present the reason they chose their cards."
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <Step key={1}>
          <Title>
            <Translate pt="Pista Secreta era: " en="The Secret Clue was: " />
            <span className="d-clue">{state.clue}</span>
          </Title>
          <Instruction>
            <AvatarName player={currentPlayer} />,{' '}
            <Translate pt="explique porque você escolheu as cartas." en="explain why you chose your cards." />
            {isUserTheCurrentPlayer && (
              <>
                <Translate
                  pt=" Quando terminar sua defesa, aperte concluir."
                  en=" When you're done, press 'End Defense'"
                />
              </>
            )}
          </Instruction>

          <TableFocus table={state.table} currentPlayer={currentPlayer} />

          {isUserTheCurrentPlayer && (
            <ButtonContainer>
              <Button type="primary" onClick={onFinishDefenseClick} disabled={isLoading} size="large">
                <Translate pt="Concluir Defesa" en="End Defense" />
              </Button>
            </ButtonContainer>
          )}
        </Step>
      </StepSwitcher>
    </PhaseContainer>
  );
}

PhaseDefense.propTypes = {
  info: PropTypes.object,
  players: PropTypes.object,
  state: PropTypes.shape({
    clue: PropTypes.string,
    phase: PropTypes.string,
    table: PropTypes.arrayOf(
      PropTypes.shape({
        playerId: PropTypes.string,
        cards: PropTypes.arrayOf(PropTypes.string),
      })
    ),
  }),
};

export default PhaseDefense;
