import { Space, Table } from 'antd';
import { AvatarName } from 'components/avatars';
import { GlyphCard } from 'components/cards/GlyphCard';
import { Translate } from 'components/language';
import type { ColumnsType } from 'antd/es/table';
import { CanvasSVG } from 'components/canvas';
import { ALIEN_CANVAS } from '../utils/constants';

type RequestHistoryProps = {
  requestHistory: RequestHistoryEntry[];
  players: GamePlayers;
};

export function RequestHistory({ requestHistory, players }: RequestHistoryProps) {
  if (requestHistory.length < 1) return <></>;

  const columns: ColumnsType<RequestHistoryEntry> = [
    {
      key: 'request',
      title: <Translate pt="Pedido" en="Request" />,
      dataIndex: 'request',
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
    {
      key: 'offers',
      title: <Translate pt="Oferendas" en="Offerings" />,
      dataIndex: 'offers',
      render: (offers) => <Offerings players={players} offers={offers} />,
    },
  ];

  return (
    <Space direction="vertical">
      <Table columns={columns} bordered dataSource={requestHistory} />
    </Space>
  );
}

type OfferingsProps = {
  offers: Offer[];
  players: GamePlayers;
};
function Offerings({ offers, players }: OfferingsProps) {
  return (
    <Space>
      {offers.map((offer) => (
        <Space direction="vertical" align="center" key={`offer-${offer.objectId}-${offer.playerId}`}>
          <GlyphCard id={`${offer.objectId}`} className={'objects-grid__item-offered'} width={50} />
          <AvatarName size="small" player={players[offer.playerId]} />
        </Space>
      ))}
    </Space>
  );
}
