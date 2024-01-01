import { has } from 'lodash';
import { ReactNode } from 'react';
// AntDesign Resources
import { Space } from 'antd';
// Type
import type { Track } from '../utils/types';

type SpaceResultCheckWrapperProps = {
  task: Track;
  paths: string[];
  children: ReactNode;
};
export function SpaceResultCheckWrapper({ task, paths, children }: SpaceResultCheckWrapperProps) {
  const okToProceed = paths.every((path) => has(task, path));

  if (okToProceed) {
    return (
      <Space className="space-container" align="center" wrap>
        {children}
      </Space>
    );
  }

  return <></>;
}
