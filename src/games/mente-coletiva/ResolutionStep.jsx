import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useTimer } from 'react-timer-hook';
// Design Resources
import { HeartFilled } from '@ant-design/icons';
// Hooks
import { useLanguage } from '../../hooks';
import { inNSeconds } from '../../utils';
// Components
import {
  Instruction,
  RankingBoard,
  Step,
  StepSwitcher,
  Title,
  translate,
  Translate,
} from '../../components/shared';
import { Pasture } from './Pasture';
import { RoundType } from './RoundType';
import { AdminForceNextPhase } from '../../components/admin';

function ResolutionStep({ ranking, players, roundType, pastureChangeStr, announceSave = false }) {
  const language = useLanguage();
  const [step, setStep] = useState(0);
  const [pastureIndex, setPastureIndex] = useState(0);
  const [showAnnounceSave, setShowAnnounceSave] = useState(false);

  const pastureChange = useMemo(() => JSON.parse(pastureChangeStr), [pastureChangeStr]);

  const { seconds } = useTimer({
    expiryTimestamp: inNSeconds(15),
    autoStart: true,
    onExpire: () => console.log('DONE'),
  });

  useEffect(() => {
    if (seconds === 7) {
      setStep(1);
    }
    if (seconds === 5) {
      setPastureIndex(1);
    }
    if (seconds === 4 && announceSave) {
      setShowAnnounceSave(true);
    }

    if (seconds === 1) {
      setPastureIndex(2);
    }
  }, [seconds]); // eslint-disable-line

  return (
    <div className="m-step">
      <Title level={1}>
        <Translate pt="Resultado" en="Results" />
      </Title>

      <RoundType roundType={roundType} />

      <StepSwitcher step={step}>
        <Step key={0}>
          <RankingBoard ranking={ranking} players={players} />
        </Step>

        <Step key={1}>
          {showAnnounceSave && (
            <Instruction contained className="m-save-card">
              <HeartFilled style={{ color: 'red' }} /> Vamos dar uma última chance para a pobre ovelhinha que
              ia morrer agora <HeartFilled style={{ color: 'red' }} />
            </Instruction>
          )}
          <Pasture players={pastureChange[pastureIndex]} />
          <AdminForceNextPhase buttonText={translate('Próxima Rodada', 'Go to Next Round', language)} />
        </Step>
      </StepSwitcher>
    </div>
  );
}

ResolutionStep.propTypes = {
  currentQuestion: PropTypes.shape({
    number: PropTypes.number,
    prefix: PropTypes.string,
    suffix: PropTypes.string,
  }),
  onSubmitAnswers: PropTypes.func,
  players: PropTypes.object,
  roundType: PropTypes.number,
  user: PropTypes.shape({
    id: PropTypes.string,
  }),
};

export default ResolutionStep;
