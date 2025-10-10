import type { ColumnsType } from 'antd/es/table';
// Ant Design Resources
import { Space, Table } from 'antd';
// Types
import type { GamePlayers } from 'types/player';
// Components
import { AvatarName } from 'components/avatars';
import { ItemCard } from 'components/cards/ItemCard';
import { Translate } from 'components/language';
// Internal
import type { Offer, PhaseBasicState, RequestHistoryEntry } from '../utils/types';
import { ItemResolution } from './ItemResolution';
import { AlienViewBoard } from './AlienViewBoard';

type RequestHistoryProps = {
  items: PhaseBasicState['items'];
  attributes: PhaseBasicState['attributes'];
  requestHistory: RequestHistoryEntry[];
  players: GamePlayers;
  isAlienBot: boolean;
  showIntention?: boolean;
};

export function RequestHistory({
  requestHistory,
  players,
  items,
  attributes,
  isAlienBot,
  showIntention,
}: RequestHistoryProps) {
  if (requestHistory.length < 1) return null;

  const columns: ColumnsType<RequestHistoryEntry> = [
    {
      key: 'request',
      title: <Translate pt="Pedido" en="Request" />,
      dataIndex: 'request',
      render: (answer) => (
        <AlienViewBoard
          request={answer}
          isAlienBot={isAlienBot}
          size="small"
          attributes={attributes}
          sentenceMode
        />
      ),
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
      render: (intention) => (intention ? <ItemCard itemId={`${intention}`} width={50} /> : <></>),
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
  items: PhaseBasicState['items'];
};
function Offerings({ offers, players, items }: OfferingsProps) {
  return (
    <Space>
      {offers.map((offer) => (
        <Space direction="vertical" align="center" key={`offer-${offer.objectId}-${offer.playerId}`}>
          <ItemCard itemId={`${offer.objectId}`} className={'objects-grid__item-offered'} width={48} />
          <AvatarName size="small" player={players[offer.playerId]} />
          <ItemResolution itemId={offer.objectId} items={items} />
        </Space>
      ))}
    </Space>
  );
}
