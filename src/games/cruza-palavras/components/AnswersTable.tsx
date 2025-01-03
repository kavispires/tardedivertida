import { orderBy } from 'lodash';
import { useMemo } from 'react';
// Ant Design Resources
import { CheckSquareFilled, CloseSquareFilled } from '@ant-design/icons';
import { Table, type TableProps } from 'antd';
// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Components
import { AvatarName } from 'components/avatars';
// Internal
import type { Grid } from '../utils/types';

type AnswersTableProps = {
  players: GamePlayers;
  grid: Grid;
  correctCoordinatesPerPlayer: StringDictionary;
};

type RowEntry = {
  playerName: string;
  player: GamePlayer;
  clue: string;
  guess: string;
  result: boolean;
};

export function AnswersTable({ players, grid, correctCoordinatesPerPlayer }: AnswersTableProps) {
  const { translate } = useLanguage();
  const columns: TableProps<RowEntry>['columns'] = [
    {
      title: translate('Jogador', 'Player'),
      dataIndex: 'player',
      key: 'player',
      render: (data) => <AvatarName player={data} />,
      sorter: (a, b) => a.playerName.localeCompare(b.playerName),
    },
    {
      title: translate('Achou que', 'Thought that'),
      dataIndex: 'guess',
      key: 'guess',
      render: (guess: string) => guess.toUpperCase(),
      sorter: (a, b) => a.guess.localeCompare(b.guess),
    },
    {
      title: translate('Era', 'Was'),
      dataIndex: 'clue',
      key: 'clue',
      render: (clue: string) => clue.toUpperCase(),
      sorter: (a, b) => a.clue.localeCompare(b.clue),
    },
    {
      title: translate('Resultado', 'Result'),
      dataIndex: 'result',
      key: 'result',
      render: (value) =>
        value ? (
          <CheckSquareFilled style={{ color: 'green' }} />
        ) : (
          <CloseSquareFilled style={{ color: 'red' }} />
        ),
      sorter: (a) => (a.result === true ? 1 : -1),
    },
  ];

  const dataSource = useMemo(() => {
    const parsedData = Object.values(players).map((player) => {
      return Object.entries<number>(player?.guesses ?? {}).reduce(
        (acc: RowEntry[], [guessedPlayerId, guessedCoordinate]) => {
          if (guessedPlayerId === player.id) return acc;

          const cell = grid[guessedCoordinate];

          acc.push({
            playerName: player.name,
            player,
            clue: `${cell.yText} + ${cell.xText}`,
            guess: players[guessedPlayerId].clue,
            result: correctCoordinatesPerPlayer?.[guessedCoordinate] === guessedPlayerId,
          });

          return acc;
        },
        [],
      );
    });

    return orderBy(parsedData.flat(), ['playerName', 'guess'], ['asc', 'asc']);
  }, [players, grid, correctCoordinatesPerPlayer]);

  return <Table size="small" columns={columns} dataSource={dataSource} pagination={false} />;
}
