import React, { memo } from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { WarningOutlined } from '@ant-design/icons';
// Components
import { Card } from './index';

export const UeSoIssoCard = memo(function ({ word, header = 'Palavra Secreta' }) {
  return (
    <Card color="purple" header={header} size="large">
      {word ?? <WarningOutlined />}
    </Card>
  );
});

UeSoIssoCard.propTypes = {
  word: PropTypes.any.isRequired,
  title: PropTypes.string,
};
