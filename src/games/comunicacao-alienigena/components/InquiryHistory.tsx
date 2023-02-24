// Ant Design Resources
import { Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
// Components
import { AvatarName } from 'components/avatars';
import { Translate } from 'components/language';
import { ItemCard } from 'components/cards/ItemCard';
import { AlienViewBoard } from './AlienViewBoard';

type InquiryHistoryProps = {
  inquiryHistory: InquiryHistoryEntry[];
  players: GamePlayers;
  isAlienBot?: boolean;
};

export function InquiryHistory({ inquiryHistory, players, isAlienBot }: InquiryHistoryProps) {
  if (inquiryHistory.length < 1) return <></>;

  const columns: ColumnsType<InquiryHistoryEntry> = [
    {
      key: 'player',
      title: <Translate pt="Jogador" en="Player" />,
      dataIndex: 'playerId',
      render: (playerId) => <AvatarName size="small" player={players[playerId]} />,
    },
    {
      key: 'items',
      title: <Translate pt="Objetos" en="Objects" />,
      dataIndex: 'objectIds',
      render: (objectIds) => <Objects objectIds={objectIds} />,
    },
    {
      key: 'answer',
      title: <Translate pt="Resposta" en="Answer" />,
      dataIndex: 'answer',
      render: (answer) => <AlienViewBoard request={answer} isAlienBot={isAlienBot} size="small" />,
    },
  ];

  return (
    <Space direction="vertical">
      <Table columns={columns} bordered dataSource={inquiryHistory} />
    </Space>
  );
}

function Objects({ objectIds }: Pick<InquiryHistoryEntry, 'objectIds'>) {
  return (
    <Space>
      {objectIds.map((objectId) => (
        <ItemCard
          key={`${objectIds.join('-')}-${objectId}`}
          id={`${objectId}`}
          className={'objects-grid__item-offered'}
          width={50}
        />
      ))}
    </Space>
  );
}
