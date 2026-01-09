// Ant Design Resources
import { Flex } from 'antd';
// Types
import type { GamePlayer } from 'types/player';
import type { SuspectCard, TestimonyQuestionCard } from 'types/tdr';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Components
import { PlayerAvatarName } from 'components/avatars';
import { AnswerNoButton, AnswerYesButton } from 'components/buttons/AnswerButtons';
import { Card } from 'components/cards';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
import { ViewIf } from 'components/views';
// Internal
import type { Status, SubmitTestimonyPayload, THistoryEntry } from './utils/types';
import { Suspects } from './components/Suspects';
import { QuestionsHistory } from './components/QuestionsHistory';
import { Summary } from './components/Summary';
// Icons

type StepQuestioningProps = {
  suspectsDict: Dictionary<SuspectCard>;
  suspectsIds: CardId[];
  previouslyEliminatedSuspects: string[];
  perpetratorId: CardId;
  isUserTheWitness: boolean;
  witness: GamePlayer;
  isLoading: boolean;
  onAnswer: (payload: SubmitTestimonyPayload) => void;
  question: TestimonyQuestionCard;
  history: THistoryEntry[];
  status: Status;
} & Pick<StepProps, 'announcement'>;

export function StepQuestioning({
  suspectsDict,
  suspectsIds,
  previouslyEliminatedSuspects,
  perpetratorId,
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
      <ViewIf condition={isUserTheWitness}>
        <StepTitle>
          <Translate
            pt={
              <>
                Testemunha <PlayerAvatarName player={witness} />, responda:
              </>
            }
            en={
              <>
                Witness <PlayerAvatarName player={witness} />, please answer:
              </>
            }
          />
        </StepTitle>
        <Flex
          align="center"
          className="margin"
          gap={12}
        >
          <AnswerNoButton
            onClick={() => onAnswer({ testimony: false })}
            disabled={!isUserTheWitness || isLoading}
          />

          <Card
            header={translate('O suspeito...', 'The perpetrator...')}
            color="blue"
            className="t-card"
            size="large"
          >
            {question.question}
          </Card>

          <AnswerYesButton
            onClick={() => onAnswer({ testimony: true })}
            disabled={!isUserTheWitness || isLoading}
          />
        </Flex>
      </ViewIf>

      <ViewIf condition={!isUserTheWitness}>
        <StepTitle>
          <Translate
            pt={
              <>
                A Testemunha <PlayerAvatarName player={witness} /> está analisando a pergunta.
              </>
            }
            en={
              <>
                The witness <PlayerAvatarName player={witness} /> is analyzing the question.
              </>
            }
          />
        </StepTitle>

        <SpaceContainer
          align="center"
          orientation="vertical"
        >
          <Card
            header={translate('O suspeito...', 'The perpetrator...')}
            color="blue"
            className="t-card"
            size="large"
          >
            {question.question}
          </Card>
        </SpaceContainer>

        <RuleInstruction type="wait">
          <Translate
            pt="Aguarde a testemunha responder."
            en="Wait for the witness to answer."
          />
        </RuleInstruction>
      </ViewIf>

      <Suspects
        suspectsDict={suspectsDict}
        suspectsIds={suspectsIds}
        perpetratorId={isUserTheWitness ? perpetratorId : undefined}
        eliminatedSuspects={previouslyEliminatedSuspects}
      />

      {history.length > 0 && (
        <QuestionsHistory
          history={history}
          suspectsDict={suspectsDict}
        />
      )}

      {status && <Summary status={status} />}
    </Step>
  );
}
