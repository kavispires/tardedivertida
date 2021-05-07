import React, { memo } from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { WarningOutlined } from '@ant-design/icons';
// Resources
import allWords from '../../resources/um-so-words.json';
// Components
import Card from './Card';

function UmSoCard({ id, header = 'Palavra Secreta' }) {
  const word = allWords[id];

  return (
    <Card color="purple" header={header} size="large">
      {word ?? <WarningOutlined />}
    </Card>
  );
}

UmSoCard.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string,
};

export default memo(UmSoCard);
