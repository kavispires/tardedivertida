// Ant Design Resources
import { Flex, Table, type TableProps } from 'antd';
// Types
import type { SuspectCard } from 'types/tdr';
// Icons
import { SpeechBubbleAcceptedIcon } from 'icons/SpeechBubbleAcceptedIcon';
import { SpeechBubbleDeclinedIcon } from 'icons/SpeechBubbleDeclinedIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { SuspectCard as SuspectCardComponent } from 'components/cards/SuspectCard';
import { Translate } from 'components/language';
import { CollapsibleRule } from 'components/rules';
// Internal
import type { THistoryEntry } from '../utils/types';

type QuestionsHistoryProps = {
  history: THistoryEntry[];
  suspectsDict: Dictionary<SuspectCard>;
};

export function QuestionsHistory({ history, suspectsDict }: QuestionsHistoryProps) {
  const columns: TableProps<THistoryEntry>['columns'] = [
    {
      title: (
        <Translate
          pt="Pergunta"
          en="Question"
        />
      ),
      dataIndex: 'question',
      key: 'question',
    },
    {
      title: (
        <Translate
          pt="Resposta"
          en="Answer"
        />
      ),
      dataIndex: 'statement',
      key: 'statement',
      render: (statement: boolean) => {
        if (statement) {
          return (
            <Flex gap={6}>
              <IconAvatar
                icon={<SpeechBubbleAcceptedIcon />}
                size="small"
              />{' '}
              <Translate
                pt="Sim"
                en="Yes"
              />
            </Flex>
          );
        }
        return (
          <Flex gap={6}>
            <IconAvatar
              icon={<SpeechBubbleDeclinedIcon />}
              size="small"
            />{' '}
            <Translate
              pt="Não"
              en="No"
            />
          </Flex>
        );
      },
    },
    {
      title: (
        <Translate
          pt="Eliminados"
          en="Eliminated"
        />
      ),
      dataIndex: 'eliminated',
      key: 'eliminated',
      render: (eliminated: string[]) => (eliminated.length ? eliminated.length : '-'),
    },
  ];

  return (
    <CollapsibleRule
      title={
        <Translate
          pt="Respostas Anteriores"
          en="Previous Answers"
        />
      }
    >
      <Table
        dataSource={history}
        columns={columns}
        pagination={false}
        rowKey="id"
        size="small"
        expandable={{
          expandedRowRender: (record) => (
            <EliminatedSuspects
              eliminated={record.eliminated}
              suspectsDict={suspectsDict}
            />
          ),
          rowExpandable: (record) => record.eliminated.length > 0,
        }}
      />
    </CollapsibleRule>
  );
}

type EliminatedSuspectsProps = {
  eliminated: CardId[];
  suspectsDict: Dictionary<SuspectCard>;
};

function EliminatedSuspects({ eliminated, suspectsDict }: EliminatedSuspectsProps) {
  return (
    <Flex
      gap={8}
      wrap
      justify="center"
    >
      {eliminated.map((id) => {
        const suspect = suspectsDict[id];
        return (
          <SuspectCardComponent
            suspect={suspect}
            key={id}
            width={100}
          />
        );
      })}
    </Flex>
  );
}
