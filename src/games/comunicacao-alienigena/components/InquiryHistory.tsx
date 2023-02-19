import { Space, Table } from 'antd';
import { AvatarName } from 'components/avatars';
import { Translate } from 'components/language';
import type { ColumnsType } from 'antd/es/table';
import { CanvasSVG } from 'components/canvas';
import { ALIEN_CANVAS } from '../utils/constants';
import { ItemCard } from 'components/cards/ItemCard';

type InquiryHistoryProps = {
  inquiryHistory: InquiryHistoryEntry[];
  players: GamePlayers;
};

export function InquiryHistory({ inquiryHistory, players }: InquiryHistoryProps) {
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
      render: (answer) => (
        <CanvasSVG
          drawing={answer}
          width={ALIEN_CANVAS.WIDTH / 2}
          height={ALIEN_CANVAS.HEIGHT / 2}
          strokeWidth="large"
          className="alien-canvas alien-canvas--small"
          viewBox={`0 0 ${ALIEN_CANVAS.WIDTH} ${ALIEN_CANVAS.HEIGHT}`}
        />
      ),
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
        <ItemCard id={`${objectId}`} className={'objects-grid__item-offered'} width={50} />
      ))}
    </Space>
  );
}
