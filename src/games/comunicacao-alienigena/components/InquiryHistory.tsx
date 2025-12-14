import type { ColumnsType } from 'antd/es/table';
// Ant Design Resources
import { Space, Table } from 'antd';
// Types
import type { GamePlayers } from 'types/player';
// Components
import { PlayerAvatarName } from 'components/avatars';
import { ItemCard } from 'components/cards/ItemCard';
import { DualTranslate, Translate } from 'components/language';
// Internal
import type { InquiryHistoryEntry, PhaseBasicState } from '../utils/types';
import { AlienViewBoard } from './AlienViewBoard';

type InquiryHistoryProps = {
  inquiryHistory: InquiryHistoryEntry[];
  players: GamePlayers;
  isAlienBot?: boolean;
  attributes: PhaseBasicState['attributes'];
  showIntention?: boolean;
  debugMode: boolean;
};

export function InquiryHistory({
  inquiryHistory,
  players,
  isAlienBot,
  attributes,
  showIntention,
  debugMode,
}: InquiryHistoryProps) {
  if (inquiryHistory.length < 1) return null;

  const columns: ColumnsType<InquiryHistoryEntry> = [
    {
      key: 'player',
      title: <Translate pt="Jogador" en="Player" />,
      dataIndex: 'playerId',
      render: (playerId) => <PlayerAvatarName size="small" player={players[playerId]} />,
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
        <AlienViewBoard request={answer} isAlienBot={isAlienBot} size="small" attributes={attributes} />
      ),
    },
  ];

  if (showIntention || debugMode) {
    columns.push({
      key: 'intention',
      title: <Translate pt="Intenção" en="Intention" />,
      dataIndex: 'intention',
      render: (intention) => <Intention attributes={attributes} intention={intention} />,
    });
  }
  if (debugMode) {
    columns.push({
      key: 'assumption',
      title: <Translate pt="Suposição" en="Assumption" />,
      dataIndex: 'assumption',
      render: (intention) => <Intention attributes={attributes} intention={intention} />,
    });
  }

  return (
    <Space orientation="vertical">
      <Table columns={columns} bordered dataSource={inquiryHistory} />
    </Space>
  );
}

function Objects({ objectIds }: Pick<InquiryHistoryEntry, 'objectIds'>) {
  return (
    <Space>
      {objectIds.map((objectId) => (
        <ItemCard key={`${objectIds.join('-')}-${objectId}`} itemId={`${objectId}`} width={48} />
      ))}
    </Space>
  );
}

type IntentionProps = {
  attributes: PhaseBasicState['attributes'];
  intention: InquiryHistoryEntry['intention'];
};
function Intention({ attributes, intention }: IntentionProps) {
  const attribute = attributes.find((attribute) => attribute.id === intention);

  return (
    <Space>
      {attribute ? (
        <DualTranslate>{attribute.name}</DualTranslate>
      ) : (
        <Translate pt="Desconhecido" en="Unknown" />
      )}
    </Space>
  );
}
