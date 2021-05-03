import React from 'react';
// Design Resources
import { Layout, Typography } from 'antd';

function GameOverPhase() {
  return (
    <Layout.Content className="phase-container phase-container--vertical ranking-phase">
      <Typography.Title className="center">Game Over</Typography.Title>
      <Typography.Paragraph className="center">
        Esse jogo foi completo, expirou, ou trancado permanentemente.
      </Typography.Paragraph>
    </Layout.Content>
  );
}

export default GameOverPhase;
