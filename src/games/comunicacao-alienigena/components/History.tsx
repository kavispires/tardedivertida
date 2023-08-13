// Ant Design Resources
import { Collapse } from 'antd';
// Components
import { Translate } from 'components/language';
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
};

export function History({
  inquiryHistory,
  requestHistory,
  players,
  items,
  isAlienBot,
  showIntention = false,
  signs,
}: HistoryProps) {
  return (
    <Collapse>
      <Collapse.Panel
        header={<Translate pt="Histórico de Perguntas dos Humanos" en="Human Inquiry History" />}
        key="1"
      >
        <InquiryHistory
          inquiryHistory={inquiryHistory}
          players={players}
          isAlienBot={isAlienBot}
          signs={signs}
          showIntention={showIntention}
        />
        {inquiryHistory.length === 0 && <Translate pt="Nenhuma pergunta ainda." en="No questions yet." />}
      </Collapse.Panel>

      <Collapse.Panel
        header={<Translate pt="Histórico de Pedidos dos Alienígenas" en="Alien Request History" />}
        key="2"
      >
        <RequestHistory
          requestHistory={requestHistory}
          players={players}
          items={items}
          isAlienBot={isAlienBot}
          showIntention={showIntention}
        />
        {requestHistory.length === 0 && <Translate pt="Nenhum pedido ainda." en="No requests yet." />}
      </Collapse.Panel>
    </Collapse>
  );
}
