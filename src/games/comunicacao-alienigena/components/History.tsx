// Ant Design Resources
import { Collapse, CollapseProps } from 'antd';
// Types
import { GamePlayers } from 'types/player';
// Components
import { Translate } from 'components/language';
// Internal
import type { InquiryHistoryEntry, Item, RequestHistoryEntry, Sign } from '../utils/types';
import { InquiryHistory } from './InquiryHistory';
import { RequestHistory } from './RequestHistory';

type HistoryProps = {
  inquiryHistory: InquiryHistoryEntry[];
  requestHistory: RequestHistoryEntry[];
  players: GamePlayers;
  items: Item[];
  isAlienBot: boolean;
  showIntention?: boolean;
  signs: Sign[];
  debugMode: boolean;
};

export function History({
  inquiryHistory,
  requestHistory,
  players,
  items,
  isAlienBot,
  showIntention = false,
  signs,
  debugMode,
}: HistoryProps) {
  const panels: CollapseProps['items'] = [
    {
      key: '1',
      label: <Translate pt="Histórico de Perguntas dos Humanos" en="Human Inquiry History" />,
      children: (
        <>
          <InquiryHistory
            inquiryHistory={inquiryHistory}
            players={players}
            isAlienBot={isAlienBot}
            signs={signs}
            showIntention={showIntention}
            debugMode={debugMode}
          />
          {inquiryHistory.length === 0 && <Translate pt="Nenhuma pergunta ainda." en="No questions yet." />}
        </>
      ),
    },
    {
      key: '2',
      label: <Translate pt="Histórico de Pedidos dos Alienígenas" en="Alien Request History" />,
      children: (
        <>
          <RequestHistory
            requestHistory={requestHistory}
            players={players}
            items={items}
            isAlienBot={isAlienBot}
            showIntention={showIntention || debugMode}
          />
          {requestHistory.length === 0 && <Translate pt="Nenhum pedido ainda." en="No requests yet." />}
        </>
      ),
    },
  ];

  return <Collapse items={panels} />;
}
