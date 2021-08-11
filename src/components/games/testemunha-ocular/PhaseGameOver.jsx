import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Hooks
import { useLanguage } from '../../../hooks';
// Resources & Utils
import { PHASES } from '../../../utils/constants';
import { SUSPECTS_NAMES } from './suspects-names';
// Components
import {
  GameOver,
  Instruction,
  PhaseAnnouncement,
  PhaseContainer,
  Step,
  StepSwitcher,
  Translate,
  translate,
} from '../../shared';
import { ImageCard } from '../../cards';

function PhaseGameOver({ state, info }) {
  const language = useLanguage();
  const [step, setStep] = useState(0);

  const didUserWin = state.outcome === 'WIN';

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.TESTEMUNHA_OCULAR.GAME_OVER}
      className="t-phase"
    >
      <StepSwitcher step={step}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type={didUserWin ? 'criminal' : 'newspaper'}
          title={
            didUserWin
              ? translate('Capturado!', 'Arrested!', language)
              : translate('O criminoso escapou!', 'They got away!', language)
          }
          onClose={() => setStep(1)}
          currentRound={state?.round?.current}
          duration={15}
        >
          {didUserWin ? (
            <Instruction>
              <Translate
                pt="O criminoso foi capturado e preso e vai morrer na cadeira elétrica! Obrigado pelo seu serviço e dedicação nesse caso!"
                en="The perpetrator was captured, arrested, and will be executed by the electrice chair! Thank you for your service!"
              />
            </Instruction>
          ) : (
            <Instruction>
              <Translate
                pt="O criminoso não foi capturado. Tudo por conta da sua investigação porca. Ele(a) saiu pelo mundo a fora cometendo mais crimes. Saiu até nos jornais"
                en="The perpetrator got away. Thanks to you and your lousy investigation. Now they are out and about committing more crimes. It was even on the news!"
              />
            </Instruction>
          )}

          {/* TODO: Preload hand */}
        </PhaseAnnouncement>

        {/* Step 1 */}
        <Step key={1}>
          <GameOver state={state}>
            <Instruction>
              <Translate
                pt={<>O interrogatório durou {state.groupScore ?? '?'} horas.</>}
                en={<>The interrogation lasted for {state.groupScore ?? '?'} hours.</>}
              />
              <br />
              <Translate pt="O criminoso era:" en="The perpetrator was:" />

              <div className="t-suspects-table__suspect">
                <ImageCard
                  imageId={state.perpetrator}
                  className="t-suspects-table__suspect-image"
                  cardWidth={150}
                />
                <div className="t-suspects-table__suspect-name">
                  {SUSPECTS_NAMES[state.perpetrator][language]}
                </div>
              </div>
            </Instruction>
          </GameOver>
        </Step>
      </StepSwitcher>
    </PhaseContainer>
  );
}

PhaseGameOver.propTypes = {
  info: PropTypes.object,
  players: PropTypes.object,
  state: PropTypes.shape({
    groupScore: PropTypes.string,
    outcome: PropTypes.string,
    perpetrator: PropTypes.string,
    phase: PropTypes.string,
    round: PropTypes.shape({
      current: PropTypes.number,
    }),
  }),
};

export default PhaseGameOver;
