import React from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Alert } from 'antd';
// Hooks
import { useLanguage } from '../../hooks';
// Components
import { translate } from '../shared';

export function PageError({ message, description }) {
  const language = useLanguage();

  return (
    <div className="container container--center">
      <Alert
        message={translate('Algo errado não está certo', 'Something wrong is not right', language, message)}
        description={translate(
          'Não era pra você estar vendo esta mensagem.',
          'You were not supposed to see this message.',
          language,
          description
        )}
        type="error"
        showIcon
      />
    </div>
  );
}

PageError.propTypes = {
  message: PropTypes.string,
  description: PropTypes.string,
};
