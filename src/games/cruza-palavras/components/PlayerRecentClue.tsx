// Types
import type { GamePlayer } from 'types/player';
// Components
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { TextHighlight, Title } from 'components/text';
// Internal
import type { GridCell } from '../utils/types';

type PlayerRecentClueProps = {
  user: GamePlayer;
  grid: GridCell[];
};

export function PlayerRecentClue({ user, grid }: PlayerRecentClueProps) {
  const cell = grid[user.coordinate];

  if (!user.clue || !cell) {
    return null;
  }

  return (
    <SpaceContainer direction="vertical">
      <Title size="xx-small">
        <Translate pt="Sua dica" en="Your clue" />
      </Title>
      <span>
        <TextHighlight>{cell.xText}</TextHighlight> + <TextHighlight>{cell.yText}</TextHighlight> ={' '}
        <TextHighlight>{user.clue}</TextHighlight>
      </span>
    </SpaceContainer>
  );
}
