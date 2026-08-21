// Ant Design Resources
import { Collapse, type CollapseProps } from 'antd';
// Types
import type { GamePlayers } from 'types/game';
// Components
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
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
          en="Human Inquiry History"
          pt="Histórico de Perguntas dos Humanos"
        />
      ),
      children: (
        <>
          <InquiryHistory
            inquiryHistory={inquiryHistory}
            players={players}
            attributes={attributes}
            showIntention={showIntention}
            debugMode={debugMode}
          />
          {inquiryHistory.length === 0 && (
            <Translate
              en="No questions yet."
              pt="Nenhuma pergunta ainda."
            />
          )}
        </>
      ),
    },
    {
      key: 'requests',
      label: (
        <Translate
          en="Alien Request History"
          pt="Histórico de Pedidos dos Alienígenas"
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
              en="No requests yet."
              pt="Nenhum pedido ainda."
            />
          )}
        </>
      ),
    },
  ];

  return (
    <Surface contained>
      <Collapse items={panels} />
    </Surface>
  );
}
