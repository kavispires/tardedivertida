// Types
import type { GamePlayer } from 'types/game';
// Components
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { TextHighlight } from '@components/text/TextHighlight';
import { Title } from '@components/text/Title';
// Internal
import type { GridCell } from '../utils/types';

type PlayerRecentClueProps = {
  user: GamePlayer;
  grid: GridCell[];
};

export function PlayerRecentClue({ user, grid }: PlayerRecentClueProps) {
  const cell = grid[user.currentClueCoordinate];

  if (!user.clue || !cell) {
    return null;
  }

  return (
    <SpaceContainer
      orientation="vertical"
      className="mb-10"
    >
      <Title size="xx-small">
        <Translate
          pt="Sua dica"
          en="Your clue"
        />
      </Title>
      <span>
        <TextHighlight>{cell.xText}</TextHighlight> + <TextHighlight>{cell.yText}</TextHighlight> ={' '}
        <TextHighlight>{user.clue}</TextHighlight>
      </span>
    </SpaceContainer>
  );
}
