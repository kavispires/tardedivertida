import { has } from 'lodash';
import type { ReactNode } from 'react';
// Types
import type { GamePlayer } from 'types/player';
// Components
import { Translate } from 'components/language/Translate';
import { TitledContainer } from 'components/layout/TitledContainer';

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
      <TitledContainer
        wrap
        title={
          <Translate
            en="Individual votes"
            pt="Votos individuais"
          />
        }
        titleProps={{ size: 'xx-small' }}
      >
        {children}
      </TitledContainer>
    );
  }

  return null;
}
