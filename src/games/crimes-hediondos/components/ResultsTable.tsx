import { orderBy } from 'lodash';
// Ant Design Resources
import { Table, Tooltip } from 'antd';
// Icons
import { BoxCheckMarkIcon } from 'icons/BoxCheckMarkIcon';
import { BoxXIcon } from 'icons/BoxXIcon';
import { BoxMinusIcon } from 'icons/BoxMinusIcon';
import { BoxOneIcon } from 'icons/BoxOneIcon';
// Components
import { AvatarName, Avatar, IconAvatar } from 'components/avatars';
import { CrimeGuessStatus } from './CrimeGuessStatus';

type ResultsTableProps = {
  players: GamePlayers;
  results: HResults;
};

export function ResultsTable({ players, results }: ResultsTableProps) {
  const columns = [
    {
      title: '',
      dataIndex: 'playerId',
      render: (playerId: string) => <AvatarName player={players[playerId]} size="small" addressUser />,
    },
    ...orderBy(Object.keys(results)).map((playerId) => ({
      title: <Avatar id={players[playerId].avatarId} size="small" />,
      dataIndex: playerId,
      render: (status: string) => <ResultsTableCell status={status} />,
    })),
  ];

  const data = orderBy(Object.entries(results))
    .filter(([key, _]) => players[key].type === 'player')
    .map(([key, result]) => {
      return {
        playerId: key,
        ...result,
      };
    });

  return <Table columns={columns} dataSource={data} pagination={false} size="small" bordered />;
}

type ResultsTableCellProps = {
  status: string;
};

function ResultsTableCell({ status }: ResultsTableCellProps) {
  switch (status) {
    case 'LOCKED':
    case 'CORRECT':
      return (
        <Tooltip title={<CrimeGuessStatus status={status} withDescription />} color="white">
          <IconAvatar icon={<BoxCheckMarkIcon />} shape="square" alt={status} />
        </Tooltip>
      );
    case 'HALF':
      return (
        <Tooltip title={<CrimeGuessStatus status={status} withDescription />} color="white">
          <IconAvatar icon={<BoxOneIcon />} shape="square" alt={status} />
        </Tooltip>
      );
    case 'WRONG':
      return (
        <Tooltip title={<CrimeGuessStatus status={status} withDescription />} color="white">
          <IconAvatar icon={<BoxMinusIcon />} shape="square" alt={status} />
        </Tooltip>
      );
    case 'WRONG_GROUP':
      return (
        <Tooltip title={<CrimeGuessStatus status={status} withDescription />} color="white">
          <IconAvatar icon={<BoxXIcon />} shape="square" alt={status} />
        </Tooltip>
      );
    default:
      return <span>•</span>;
  }
}
