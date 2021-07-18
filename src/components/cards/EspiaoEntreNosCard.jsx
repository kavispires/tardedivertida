import React, { memo } from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { QuestionCircleFilled } from '@ant-design/icons';
// Components
import { Card } from './index';

export const EspiaoEntreNosCard = memo(function ({ location, role, header = 'Local' }) {
  return (
    <Card
      color={location === 'SPY' ? 'red' : 'lime'}
      header={location === 'SPY' ? 'Local Desconhecido' : header}
      size="large"
      footer={`Você é ${role === 'SPY' ? 'o espião' : `um(a) ${role}`} `}
      className="e-card"
      footerClassName="e-card__footer"
    >
      {location === 'SPY' ? <QuestionCircleFilled /> : location}
    </Card>
  );
});

EspiaoEntreNosCard.propTypes = {
  location: PropTypes.string,
  header: PropTypes.string,
  role: PropTypes.string,
};
