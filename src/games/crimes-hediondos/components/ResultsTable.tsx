import { orderBy } from 'lodash';
// Ant Design Resources
import { Table, Tooltip } from 'antd';
// Types
import type { GamePlayers } from 'types/player';
// Icons
import { BoxCheckMarkIcon } from 'icons/BoxCheckMarkIcon';
import { BoxMinusIcon } from 'icons/BoxMinusIcon';
import { BoxOneIcon } from 'icons/BoxOneIcon';
import { BoxThreeIcon } from 'icons/BoxThreeIcon';
import { BoxTwoIcon } from 'icons/BoxTwoIcon';
import { BoxXIcon } from 'icons/BoxXIcon';
// Components
import { PlayerAvatarName, PlayerAvatar, IconAvatar } from 'components/avatars';
// Internal
import type { Results } from '../utils/types';
import { GUESS_STATUS } from '../utils/constants';
import { CrimeGuessStatus } from './CrimeGuessStatus';

type ResultsTableProps = {
  players: GamePlayers;
  results: Results;
};

export function ResultsTable({ players, results }: ResultsTableProps) {
  const columns = [
    {
      title: '',
      dataIndex: 'playerId',
      render: (playerId: string) => <PlayerAvatarName player={players[playerId]} size="small" addressUser />,
    },
    ...orderBy(Object.keys(results)).map((playerId) => ({
      title: <PlayerAvatar avatarId={players[playerId].avatarId} size="small" />,
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
    case GUESS_STATUS.LOCKED:
    case GUESS_STATUS.CORRECT:
      return (
        <Tooltip title={<CrimeGuessStatus status={status} withDescription />} color="white">
          <IconAvatar icon={<BoxCheckMarkIcon />} shape="square" alt={status} />
        </Tooltip>
      );
    case GUESS_STATUS.ONE:
      return (
        <Tooltip title={<CrimeGuessStatus status={status} withDescription />} color="white">
          <IconAvatar icon={<BoxOneIcon />} shape="square" alt={status} />
        </Tooltip>
      );
    case GUESS_STATUS.TWO:
      return (
        <Tooltip title={<CrimeGuessStatus status={status} withDescription />} color="white">
          <IconAvatar icon={<BoxTwoIcon />} shape="square" alt={status} />
        </Tooltip>
      );
    case GUESS_STATUS.THREE:
      return (
        <Tooltip title={<CrimeGuessStatus status={status} withDescription />} color="white">
          <IconAvatar icon={<BoxThreeIcon />} shape="square" alt={status} />
        </Tooltip>
      );
    case GUESS_STATUS.WRONG:
      return (
        <Tooltip title={<CrimeGuessStatus status={status} withDescription />} color="white">
          <IconAvatar icon={<BoxMinusIcon />} shape="square" alt={status} />
        </Tooltip>
      );
    case GUESS_STATUS.WRONG_GROUP:
      return (
        <Tooltip title={<CrimeGuessStatus status={status} withDescription />} color="white">
          <IconAvatar icon={<BoxXIcon />} shape="square" alt={status} />
        </Tooltip>
      );
    default:
      return <span>•</span>;
  }
}
