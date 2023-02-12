import { Collapse } from 'antd';
import { Translate } from 'components/language';
import { InquiryHistory } from './InquiryHistory';
import { RequestHistory } from './RequestHistory';

type HistoryProps = {
  inquiryHistory: InquiryHistoryEntry[];
  requestHistory: RequestHistoryEntry[];
  players: GamePlayers;
};

export function History({ inquiryHistory, requestHistory, players }: HistoryProps) {
  return (
    <Collapse>
      <Collapse.Panel
        header={<Translate pt="Histórico de Perguntas dos Humanos" en="Human Inquiry History" />}
        key="1"
      >
        <InquiryHistory inquiryHistory={inquiryHistory} players={players} />
      </Collapse.Panel>

      <Collapse.Panel
        header={<Translate pt="Histórico de Pedidos dos Alienígenas" en="Alien Request History" />}
        key="2"
      >
        <RequestHistory requestHistory={requestHistory} players={players} />
      </Collapse.Panel>
    </Collapse>
  );
}
