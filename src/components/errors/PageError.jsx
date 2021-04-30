import React from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Alert } from 'antd';

function PageError({ message, description }) {
  return (
    <div className="container container--center">
      <Alert message={message} description={description} type="error" showIcon />
    </div>
  );
}

PageError.propTypes = {
  message: PropTypes.string,
  description: PropTypes.string,
};

PageError.defaultProps = {
  message: 'Algo errado não está certo',
  description: 'Não era pra você estar vendo esta mensagem.',
};

export default PageError;
