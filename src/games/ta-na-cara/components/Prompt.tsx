// Ant Design Resources
import { FireFilled, UserOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
// Types
import type { GamePlayer } from 'types/player';
import type { TestimonyQuestionCard } from 'types/tdr';
// Components
import { Card } from 'components/cards';
import { Translate } from 'components/language';

type PromptProps = {
  question: TestimonyQuestionCard;
  creator?: GamePlayer;
};

export function Prompt({ question, creator }: PromptProps) {
  return (
    <Card
      hideHeader
      className="ta-na-cara-prompt"
      footer={
        creator && (
          <span className="ta-na-cara-prompt__footer">
            <Translate pt="Criada por:" en="Created by:" /> {creator?.name}
          </span>
        )
      }
    >
      {question.nsfw && (
        <Tooltip title={<Translate pt="Conteúdo Polêmico" en="NSFW Content" />}>
          <FireFilled style={{ color: 'hotPink' }} className="pr-2" />
        </Tooltip>
      )}
      {creator && (
        <Tooltip title={<Translate pt="Pergunta customizada" en="Custom Question" />}>
          <UserOutlined />
        </Tooltip>
      )}
      <span>{question.question}</span>
    </Card>
  );
}
