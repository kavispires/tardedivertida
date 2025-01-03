// Ant Design Resources
import { Avatar, Button, Flex } from 'antd';
// Types
import type { GamePlayer } from 'types/player';
import type { SuspectCard } from 'types/tdr';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Icons
import { SpeechBubbleAcceptedIcon } from 'icons/SpeechBubbleAcceptedIcon';
import { SpeechBubbleDeclinedIcon } from 'icons/SpeechBubbleDeclinedIcon';
// Components
import { AvatarName } from 'components/avatars';
import { Card } from 'components/cards';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { Step, type StepProps } from 'components/steps';
import { Instruction, RuleInstruction, StepTitle } from 'components/text';
import { ViewIf } from 'components/views';
// Internal
import type { Status, SubmitTestimonyPayload, THistoryEntry } from './utils/types';
import { Suspects } from './components/Suspects';
import { QuestionsHistory } from './components/QuestionsHistory';
import { Summary } from './components/Summary';

type StepQuestioningProps = {
  suspects: SuspectCard[];
  previouslyEliminatedSuspects: string[];
  perpetrator: SuspectCard;
  isUserTheWitness: boolean;
  witness: GamePlayer;
  isLoading: boolean;
  onAnswer: (payload: SubmitTestimonyPayload) => void;
  question: GamePlayer;
  history: THistoryEntry[];
  status: Status;
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
  status,
}: StepQuestioningProps) {
  const { translate } = useLanguage();

  return (
    <Step announcement={announcement}>
      <StepTitle>
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
      </StepTitle>

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
        <SpaceContainer align="center" direction="vertical">
          <Card
            header={translate('O suspeito...', 'The perpetrator...')}
            randomColor
            className="t-card"
            size="large"
          >
            {question.question}
          </Card>
        </SpaceContainer>

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

      {status && <Summary status={status} />}
    </Step>
  );
}
