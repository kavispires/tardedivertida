// Ant Design Resources
import { Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
// Types
import type { InquiryHistoryEntry, Sign } from '../utils/types';
// Components
import { AvatarName } from 'components/avatars';
import { DualTranslate, Translate } from 'components/language';
import { ItemCard } from 'components/cards/ItemCard';
import { AlienViewBoard } from './AlienViewBoard';

type InquiryHistoryProps = {
  inquiryHistory: InquiryHistoryEntry[];
  players: GamePlayers;
  isAlienBot?: boolean;
  signs: Sign[];
  showIntention?: boolean;
  debugMode: boolean;
};

export function InquiryHistory({
  inquiryHistory,
  players,
  isAlienBot,
  signs,
  showIntention,
  debugMode,
}: InquiryHistoryProps) {
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

  if (showIntention || debugMode) {
    columns.push({
      key: 'intention',
      title: <Translate pt="Intenção" en="Intention" />,
      dataIndex: 'intention',
      render: (intention) => <Intention signs={signs} intention={intention} />,
    });
  }

  if (isAlienBot) {
    columns.push({
      key: 'confidence',
      title: <Translate pt="Confiança" en="Confidence" />,
      dataIndex: 'confidence',
      render: (value) => <span>{value}%</span>,
    });
  }
  if (debugMode) {
    columns.push({
      key: 'assumption',
      title: <Translate pt="Suposição" en="Assumption" />,
      dataIndex: 'assumption',
    });
  }

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

type IntentionProps = {
  signs: Sign[];
  intention: Pick<InquiryHistoryEntry, 'intention'>;
};
function Intention({ signs, intention }: IntentionProps) {
  const attribute = signs.find((sign) => sign.key === intention);

  return (
    <Space>
      {Boolean(attribute) ? (
        <DualTranslate>{attribute!.attribute}</DualTranslate>
      ) : (
        <Translate pt="Desconhecido" en="Unknown" />
      )}
    </Space>
  );
}
