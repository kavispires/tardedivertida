// Ant Design Resources
import { Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
// Types
import { GamePlayers } from 'types/player';
import type { Item, Offer, RequestHistoryEntry } from '../utils/types';
// Components
import { AvatarName } from 'components/avatars';
import { Translate } from 'components/language';
import { ItemCard } from 'components/cards/ItemCard';
import { ItemResolution } from './ItemResolution';
import { AlienViewBoard } from './AlienViewBoard';

type RequestHistoryProps = {
  requestHistory: RequestHistoryEntry[];
  players: GamePlayers;
  items: Item[];
  isAlienBot: boolean;
  showIntention?: boolean;
};

export function RequestHistory({
  requestHistory,
  players,
  items,
  isAlienBot,
  showIntention,
}: RequestHistoryProps) {
  if (requestHistory.length < 1) return <></>;

  const columns: ColumnsType<RequestHistoryEntry> = [
    {
      key: 'request',
      title: <Translate pt="Pedido" en="Request" />,
      dataIndex: 'request',
      render: (answer) => <AlienViewBoard request={answer} isAlienBot={isAlienBot} size="small" />,
    },
    {
      key: 'offers',
      title: <Translate pt="Oferendas" en="Offerings" />,
      dataIndex: 'offers',
      render: (offers) => <Offerings players={players} offers={offers} items={items} />,
    },
  ];

  if (showIntention) {
    columns.push({
      key: 'intention',
      title: <Translate pt="Intenção" en="Intention" />,
      dataIndex: 'intention',
      render: (intention) => (Boolean(intention) ? <ItemCard id={`${intention}`} width={50} /> : <></>),
    });
  }

  return (
    <Space direction="vertical">
      <Table columns={columns} bordered dataSource={requestHistory} />
    </Space>
  );
}

type OfferingsProps = {
  offers: Offer[];
  players: GamePlayers;
  items: Item[];
};
function Offerings({ offers, players, items }: OfferingsProps) {
  return (
    <Space>
      {offers.map((offer) => (
        <Space direction="vertical" align="center" key={`offer-${offer.objectId}-${offer.playerId}`}>
          <ItemCard id={`${offer.objectId}`} className={'objects-grid__item-offered'} width={50} />
          <AvatarName size="small" player={players[offer.playerId]} />
          <ItemResolution itemId={offer.objectId} items={items} />
        </Space>
      ))}
    </Space>
  );
}
