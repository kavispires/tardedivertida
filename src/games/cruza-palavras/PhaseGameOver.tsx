// Ant Design Resources
import { Divider } from 'antd';
// Types
import type { PhaseProps } from 'types/game';
// Icons
import { TrophyIcon } from 'icons/TrophyIcon';
// Components
import { GameOverWrapper } from 'components/game-over';
import { Achievements } from 'components/general/Achievements';
import { Translate } from 'components/language';
import { TitledContainer } from 'components/layout/TitledContainer';
// Internal
import achievementsReference from './utils/achievements';
import type { PhaseGameOverState } from './utils/types';
import { ResultCell } from './components/ResultCell';
import { WordGrid } from './components/WordGrid';

export function PhaseGameOver({ state, players, user }: PhaseProps<PhaseGameOverState>) {
  return (
    <GameOverWrapper state={state} players={players} announcementIcon={<TrophyIcon />}>
      <Achievements players={players} achievements={state.achievements} reference={achievementsReference} />

      <Divider />

      <TitledContainer title={<Translate en="The Final Grid" pt="A Grade Final" />}>
        <WordGrid
          grid={state.grid}
          gridType={state.gameType}
          user={user}
          CellComponent={ResultCell}
          cellComponentProps={{
            clues: [],
            players,
            playerPerVotedCell: {},
            colorCodedCluesPerPlayer: {},
          }}
        />
      </TitledContainer>
    </GameOverWrapper>
  );
}
