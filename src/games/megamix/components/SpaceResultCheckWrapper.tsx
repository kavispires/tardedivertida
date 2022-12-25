import { Space } from 'antd';
import { has } from 'lodash';
import { ReactNode } from 'react';

type SpaceResultCheckWrapperProps = {
  task: Task;
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
