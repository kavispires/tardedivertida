import { keyBy } from 'lodash';
import { useMemo } from 'react';
// Ant Design Resources
import { Collapse, Table, type TableProps, type CollapseProps, Flex } from 'antd';
// Types
import type { GamePlayers } from 'types/game';
// Components
import { AlienText } from '@components/alien/AlienText';
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
// Internal
import type { DeckEntry, HistoryEntry } from '../utils/types';
import { HistoryDeliverableEntry } from './HistoryDeliverableEntry';

type HistoryProps = {
  players: GamePlayers;
  history: HistoryEntry[];
  clueInputType: string;
  deck: DeckEntry[];
  deckType: string;
  userSide: string;
};

export function History({ history, players, deck, deckType, clueInputType, userSide }: HistoryProps) {
  const deckDict = useMemo(() => keyBy(deck, 'id'), [deck]);

  const columns: TableProps<HistoryEntry>['columns'] = [
    {
      key: 'player',
      title: (
        <Translate
          pt="Jogador"
          en="Player"
        />
      ),
      dataIndex: 'requesterId',
      render: (requesterId) => <PlayerAvatarName player={players[requesterId]} />,
    },
    {
      key: 'clue',
      title: (
        <Translate
          pt="Pedido"
          en="Dica"
        />
      ),
      dataIndex: 'clue',
      render: (clue) => {
        if (clueInputType === 'alien-keyboard') {
          return (
            <AlienText
              value={clue}
              withTranslation
            />
          );
        }
        return clue;
      },
    },
    {
      key: 'quantity',
      title: (
        <Translate
          pt="Quantidade"
          en="Quantity"
        />
      ),
      dataIndex: 'quantity',
    },
    {
      key: 'deliverables',
      title: (
        <Translate
          pt="Itens"
          en="Items"
        />
      ),
      dataIndex: 'deliverables',
      render: (deliverables: string[]) => {
        return (
          <Flex
            wrap="wrap"
            gap={8}
          >
            {deliverables.map((deliverableId) => (
              <HistoryDeliverableEntry
                key={deliverableId}
                deliverable={deckDict[deliverableId]}
                deckType={deckType}
                userSide={userSide}
              />
            ))}
          </Flex>
        );
      },
    },
  ];

  const panels: CollapseProps['items'] = [
    {
      key: 'history',
      label: (
        <Translate
          pt="Histórico de Perguntas"
          en="Inquiry History"
        />
      ),
      children: (
        <Table
          dataSource={history}
          columns={columns}
          pagination={false}
        />
      ),
    },
  ];

  return (
    <Surface contained>
      <Collapse items={panels} />
    </Surface>
  );
}
