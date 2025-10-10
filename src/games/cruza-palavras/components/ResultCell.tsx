import clsx from 'clsx';
// Ant Design Resources
import { CloseSquareOutlined } from '@ant-design/icons';
// Types
import type { GamePlayers } from 'types/player';
// Components
import { PlayerAvatarName } from 'components/avatars';
// Internal
import type { Clue, GridCell, ResultPlayerCell } from '../utils/types';
import { ClueCard } from './ClueCard';
import { PreviousClue } from './PreviousClue';

type PlayersInCellProps = {
  cellPlayers: ResultPlayerCell[];
  players: GamePlayers;
};

function PlayersInCell({ cellPlayers, players }: PlayersInCellProps) {
  return (
    <ul>
      {cellPlayers.map(({ playerId, isCorrect }) =>
        isCorrect ? (
          <li
            key={`players-in-cell-${playerId}`}
            className={clsx(isCorrect && 'x-players-in-cell-player--correct')}
          >
            <PlayerAvatarName player={players[playerId]} size="small" />
          </li>
        ) : undefined,
      )}
    </ul>
  );
}

type ResultCellProps = {
  cell: GridCell;
  clues: Clue[];
  players: GamePlayers;
  playerPerVotedCell: Dictionary<ResultPlayerCell[]>;
  colorCodedCluesPerPlayer: StringDictionary;
};

export function ResultCell({
  cell,
  clues,
  players,
  playerPerVotedCell,
  colorCodedCluesPerPlayer,
}: ResultCellProps) {
  const clue = clues.find((c) => c.coordinate === cell.index);
  const cellPlayers = (playerPerVotedCell[cell.index] ?? []).filter((e) => e.isCorrect);

  if (clue?.playerId) {
    return (
      <div className="center">
        <ClueCard
          isMatched
          clue={clue.clue}
          color={colorCodedCluesPerPlayer[clue.playerId]}
          player={players[clue.playerId]}
        />
        {cellPlayers.length ? (
          <PlayersInCell cellPlayers={cellPlayers} players={players} />
        ) : (
          <CloseSquareOutlined style={{ color: 'white' }} />
        )}
      </div>
    );
  }

  if (cell.text) {
    return <PreviousClue clue={cell.text} />;
  }

  return (
    <span>
      {Boolean(cellPlayers.length) && <PlayersInCell cellPlayers={cellPlayers} players={players} />}
    </span>
  );
}
