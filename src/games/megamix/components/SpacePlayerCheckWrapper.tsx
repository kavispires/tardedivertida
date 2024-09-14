import { has } from 'lodash';
import { ReactNode } from 'react';
// Ant Design Resources
import { Space } from 'antd';
// Types
import type { GamePlayer } from 'types/player';

type SpacePlayerCheckWrapperProps = {
  playersList: GamePlayer[];
  paths: string[];
  children: ReactNode;
};
export function SpacePlayerCheckWrapper({ playersList, paths, children }: SpacePlayerCheckWrapperProps) {
  const okToProceed = playersList.every((player) => {
    return paths.every((path) => {
      return has(player, path);
    });
  });

  if (okToProceed) {
    return (
      <Space className="space-container" align="center" wrap>
        {children}
      </Space>
    );
  }

  return <></>;
}
