import React from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Layout, Spin, Typography } from 'antd';
import { Translate } from '../shared';

export function LoadingPage({ message }) {
  return (
    <Layout.Content className="loading-page">
      <Spin size="large" />
      <Typography.Text>
        <Translate pt="Carregando..." en="Loading..." custom={message} />
      </Typography.Text>
    </Layout.Content>
  );
}

LoadingPage.propTypes = {
  message: PropTypes.string,
};
