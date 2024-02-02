// Ant Design Resources
import { Avatar, Button, Flex, Space } from 'antd';
// Types
import type { GamePlayer } from 'types/player';
import type { SuspectCard } from 'types/tdr';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Icons
import { SpeechBubbleAcceptedIcon } from 'icons/SpeechBubbleAcceptedIcon';
import { SpeechBubbleDeclinedIcon } from 'icons/SpeechBubbleDeclinedIcon';
// Components
import { Suspects } from './components/Suspects';
import { QuestionsHistory } from './components/QuestionsHistory';
import { Step, type StepProps } from 'components/steps';
import { Instruction, RuleInstruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { AvatarName } from 'components/avatars';
import { Card } from 'components/cards';
import { ViewIf } from 'components/views';

type StepQuestioningProps = {
  suspects: SuspectCard[];
  previouslyEliminatedSuspects: string[];
  perpetrator: SuspectCard;
  isUserTheWitness: boolean;
  witness: GamePlayer;
  isLoading: boolean;
  onAnswer: GenericFunction;
  question: GamePlayer;
  history: THistoryEntry[];
} & Pick<StepProps, 'announcement'>;

export function StepQuestioning({
  suspects,
  previouslyEliminatedSuspects,
  perpetrator,
  isUserTheWitness,
  witness,
  isLoading,
  onAnswer,
  question,
  history,
  announcement,
}: StepQuestioningProps) {
  const { translate } = useLanguage();

  return (
    <Step announcement={announcement}>
      <Title level={3} size="medium">
        <Translate
          pt={
            <>
              Testemunha <AvatarName player={witness} />, responda:
            </>
          }
          en={
            <>
              Witness <AvatarName player={witness} />, please answer:
            </>
          }
        />
      </Title>

      <ViewIf condition={isUserTheWitness}>
        <Flex align="center" className="margin">
          <Instruction contained>
            <Button
              type="text"
              size="large"
              onClick={() => onAnswer({ testimony: false })}
              className="t-questioning-answer-grid__button t-questioning-answer-grid__button--no"
              disabled={!isUserTheWitness || isLoading}
            >
              <span className="t-questioning-answer-grid__answer">
                <Translate pt="Não" en="No" />
              </span>
              <Avatar
                size="large"
                icon={<SpeechBubbleDeclinedIcon />}
                style={{ backgroundColor: 'transparent' }}
                shape="square"
              />
            </Button>
          </Instruction>

          <Card
            header={translate('O suspeito...', 'The perpetrator...')}
            randomColor
            className="t-card"
            size="large"
          >
            {question.question}
          </Card>

          <Instruction contained>
            <Button
              type="text"
              size="large"
              onClick={() => onAnswer({ testimony: true })}
              className="t-questioning-answer-grid__button t-questioning-answer-grid__button--no"
              disabled={!isUserTheWitness || isLoading}
            >
              <Avatar
                size="large"
                icon={<SpeechBubbleAcceptedIcon />}
                style={{ backgroundColor: 'transparent' }}
                shape="square"
              />
              <span className="t-questioning-answer-grid__answer">
                <Translate pt="Sim" en="Yes" />
              </span>
            </Button>
          </Instruction>
        </Flex>
      </ViewIf>

      <ViewIf condition={!isUserTheWitness}>
        <Space className="space-container" align="center" direction="vertical">
          <Card
            header={translate('O suspeito...', 'The perpetrator...')}
            randomColor
            className="t-card"
            size="large"
          >
            {question.question}
          </Card>
        </Space>

        <RuleInstruction type="wait">
          <Translate pt="Aguarde a testemunha responder." en="Wait for the witness to answer." />
        </RuleInstruction>
      </ViewIf>

      <Suspects
        suspects={suspects}
        perpetrator={isUserTheWitness ? perpetrator : undefined}
        eliminatedSuspects={previouslyEliminatedSuspects}
      />

      {history.length > 0 && <QuestionsHistory history={history} />}
    </Step>
  );
}
