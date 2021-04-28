import React from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Layout, Spin, Typography } from 'antd';

function LoadingPage({ message }) {
  return (
    <Layout.Content className="loading-page">
      <Spin size="large" />
      <Typography.Text>{message}</Typography.Text>
    </Layout.Content>
  );
}

LoadingPage.propTypes = {
  message: PropTypes.string,
};

LoadingPage.defaultProps = {
  message: 'Carregando...',
};

export default LoadingPage;
