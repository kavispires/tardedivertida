import React, { memo } from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { WarningOutlined } from '@ant-design/icons';
// Resources and Utils
import allCards from '../../resources/arte-ruim-cards.json';
import { getColorFromLetter } from '../../utils';
// Components
import Card from './Card';

function ArteRuimCard({ id, header = 'X' }) {
  const card = allCards[id];

  return (
    <Card
      color={getColorFromLetter(header)}
      header={header}
      size="large"
      footer={Array(card?.level).fill('•').join('')}
    >
      {card?.text ?? <WarningOutlined />}
    </Card>
  );
}

ArteRuimCard.propTypes = {
  id: PropTypes.string.isRequired,
  header: PropTypes.string,
  level: PropTypes.number,
};

export default memo(ArteRuimCard);
