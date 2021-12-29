import { memo } from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { WarningOutlined } from '@ant-design/icons';
// Components
import { Card } from './index';
import { useLanguage } from '../../hooks';
import { translate } from '../shared';

export const UeSoIssoCard = memo(function ({ word, header }) {
  const language = useLanguage();

  return (
    <Card
      color="purple"
      header={translate('A Palavra Secreta é', 'Secret Word', language, header)}
      size="large"
    >
      {word ?? <WarningOutlined />}
    </Card>
  );
});

UeSoIssoCard.propTypes = {
  word: PropTypes.any.isRequired,
  title: PropTypes.string,
};
