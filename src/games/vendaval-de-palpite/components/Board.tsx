import { Avatar, Tooltip } from 'antd';
import clsx from 'clsx';
import { AvatarName } from 'components/avatars';
import { IconAvatar } from 'components/icons/IconAvatar';
import { QuestionIcon } from 'components/icons/QuestionIcon';
import { Translate } from 'components/language';

type BoardProps = {
  board: VBoard;
  clues: VClues;
  players: GamePlayers;
};

export function Board({ board, clues, players }: BoardProps) {
  const boardEntries = Object.keys(board);
  return (
    <div className="v-board">
      {boardEntries.map((boardKey, index) => {
        const boardEntry = board[boardKey];
        const isLatestBoard = index === boardEntries.length - 1;

        return (
          <div
            key={`board-key-${boardKey}`}
            className={clsx('v-board__entry', isLatestBoard && 'v-board__entry--active')}
          >
            <ul className="v-board__clues">
              {boardEntry.clues.map((clueId) => (
                <Clue clue={clues[clueId]} key={clueId} players={players} />
              ))}
            </ul>
            <div className="v-board__evaluation">
              {boardEntry.evaluation !== undefined ? (
                <Tooltip title={<Translate pt="Quantidade de dicas corretas" en="Amount of correct clues" />}>
                  <Avatar size={48} shape="circle" style={{ backgroundColor: 'green' }}>
                    {boardEntry.evaluation}
                  </Avatar>
                </Tooltip>
              ) : (
                <IconAvatar icon={<QuestionIcon />} size={48} shape="square" />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

type ClueProps = {
  clue: VClue;
  players: GamePlayers;
};

function Clue({ clue, players }: ClueProps) {
  return (
    <li className="v-clue">
      <div className={clsx('v-clue__text', clue.isGuess && 'v-clue__text--guess')}>
        <div className="v-clue__text-inner">{clue.clue}</div>
      </div>
      <div className="v-clue__player">
        <AvatarName player={players[clue.playerId]} />
      </div>
    </li>
  );
}
