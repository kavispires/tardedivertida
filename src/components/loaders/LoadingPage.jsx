import React from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Layout, Spin, Typography } from 'antd';
import { translate } from '../shared';
import { useLanguage } from '../../hooks';

export function LoadingPage({ message }) {
  const language = useLanguage();

  return (
    <Layout.Content className="loading-page">
      <Spin size="large" />
      <Typography.Text>{message || translate('Carregando...', 'Loading...', language)}</Typography.Text>
    </Layout.Content>
  );
}

LoadingPage.propTypes = {
  message: PropTypes.string,
};
