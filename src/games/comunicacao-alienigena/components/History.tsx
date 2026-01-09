// Ant Design Resources
import { Collapse, type CollapseProps } from 'antd';
// Types
import type { GamePlayers } from 'types/player';
// Components
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
// Internal
import type { InquiryHistoryEntry, PhaseBasicState, RequestHistoryEntry } from '../utils/types';
import { InquiryHistory } from './InquiryHistory';
import { RequestHistory } from './RequestHistory';

type HistoryProps = {
  inquiryHistory: InquiryHistoryEntry[];
  requestHistory: RequestHistoryEntry[];
  players: GamePlayers;
  isAlienBot: boolean;
  showIntention?: boolean;
  items: PhaseBasicState['items'];
  attributes: PhaseBasicState['attributes'];
  debugMode: boolean;
};

export function History({
  inquiryHistory,
  requestHistory,
  players,
  items,
  isAlienBot,
  showIntention = false,
  attributes,
  debugMode,
}: HistoryProps) {
  const panels: CollapseProps['items'] = [
    {
      key: 'inquiries',
      label: (
        <Translate
          pt="Histórico de Perguntas dos Humanos"
          en="Human Inquiry History"
        />
      ),
      children: (
        <>
          <InquiryHistory
            inquiryHistory={inquiryHistory}
            players={players}
            isAlienBot={isAlienBot}
            attributes={attributes}
            showIntention={showIntention}
            debugMode={debugMode}
          />
          {inquiryHistory.length === 0 && (
            <Translate
              pt="Nenhuma pergunta ainda."
              en="No questions yet."
            />
          )}
        </>
      ),
    },
    {
      key: 'requests',
      label: (
        <Translate
          pt="Histórico de Pedidos dos Alienígenas"
          en="Alien Request History"
        />
      ),
      children: (
        <>
          <RequestHistory
            requestHistory={requestHistory}
            players={players}
            items={items}
            isAlienBot={isAlienBot}
            showIntention={showIntention || debugMode}
            attributes={attributes}
          />
          {requestHistory.length === 0 && (
            <Translate
              pt="Nenhum pedido ainda."
              en="No requests yet."
            />
          )}
        </>
      ),
    },
  ];

  return (
    <Instruction contained>
      <Collapse items={panels} />
    </Instruction>
  );
}
