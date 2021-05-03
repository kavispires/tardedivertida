import React from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Button, Typography } from 'antd';

function DrawPhaseStepOne({ setStep, round, play }) {
  return (
    <div className="draw-phase-step-one">
      <Typography.Title className="draw-phase-step-one__title">RODADA</Typography.Title>
      <div className="draw-phase-step-one__round">{round ?? 0}</div>
      <Typography.Text className="draw-phase-step-one__instructions">
        Você terá 10 segundos para ler a sua carta e desenhá-la. Aperte o botão quando estiver pronto! Fique
        esperto porque começa assim quando você apertar. Não 'seje' lerdo.
      </Typography.Text>
      <Button
        type="primary"
        onClick={() => {
          play();
          setStep(2);
        }}
        className="draw-phase-step-one__go-button"
      >
        Um dó, lá, si... vamos ir... JÁ!
      </Button>
    </div>
  );
}

DrawPhaseStepOne.propTypes = {
  round: PropTypes.number,
  setStep: PropTypes.func.isRequired,
};

export default DrawPhaseStepOne;
