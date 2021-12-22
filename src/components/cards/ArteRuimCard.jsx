import React, { memo } from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { WarningOutlined } from '@ant-design/icons';
import { getColorFromLetter } from '../../utils/helpers';
// Components
import { Card } from './index';

export const ArteRuimCard = memo(function ({ text, level, header = 'X' }) {
  return (
    <Card
      color={getColorFromLetter(header)}
      header={header}
      size="medium"
      footer={Array(level).fill('•').join('')}
    >
      {text ?? <WarningOutlined />}
    </Card>
  );
});

ArteRuimCard.propTypes = {
  text: PropTypes.string.isRequired,
  header: PropTypes.string,
  level: PropTypes.number,
};
