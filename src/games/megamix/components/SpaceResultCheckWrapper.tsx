import { has } from 'lodash';
import type { ReactNode } from 'react';
// Components
import { SpaceContainer } from 'components/layout/SpaceContainer';
// Internal
import type { Track } from '../utils/types';

type SpaceResultCheckWrapperProps = {
  task: Track;
  paths: string[];
  children: ReactNode;
};
export function SpaceResultCheckWrapper({ task, paths, children }: SpaceResultCheckWrapperProps) {
  const okToProceed = paths.every((path) => has(task, path));

  if (okToProceed) {
    return <SpaceContainer wrap>{children}</SpaceContainer>;
  }

  return <></>;
}
