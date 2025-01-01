import { has } from 'lodash';
import type { ReactNode } from 'react';
// Types
import type { GamePlayer } from 'types/player';
// Components
import { SpaceContainer } from 'components/layout/SpaceContainer';

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
    return <SpaceContainer wrap>{children}</SpaceContainer>;
  }

  return <></>;
}
