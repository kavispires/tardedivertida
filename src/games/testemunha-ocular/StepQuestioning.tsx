// Ant Design Resources
import { Avatar, Button } from 'antd';
// Hooks
import { useLanguage } from 'hooks';
// Components

import { Suspects } from './components/Suspects';
import { QuestionsHistory } from './components/QuestionsHistory';
import { Step } from 'components/steps';
import { Title } from 'components/text';
import { Translate } from 'components/language';
import { AvatarName } from 'components/avatars';
import { Icons } from 'components/icons';
import { Card } from 'components/cards';

type StepQuestioningProps = {
  suspects: Suspect[];
  previouslyEliminatedSuspects: string[];
  perpetrator: Suspect;
  isUserTheWitness: boolean;
  witness: GamePlayer;
  isLoading: boolean;
  onAnswer: GenericFunction;
  question: GamePlayer;
  history: THistoryEntry[];
};

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
}: StepQuestioningProps) {
  const { translate } = useLanguage();

  return (
    <Step>
      <Title level={3}>
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
        <br />
        <div className="t-questioning-answer-grid">
          {isUserTheWitness ? (
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
                icon={<Icons.SpeechBubbleDeclined />}
                style={{ backgroundColor: 'transparent' }}
                shape="square"
              />
            </Button>
          ) : (
            <div></div>
          )}

          <Card header={translate('O suspeito...', 'The perpetrator...')} randomColor className="t-card">
            {question.question}
          </Card>
          {isUserTheWitness ? (
            <Button
              type="text"
              size="large"
              onClick={() => onAnswer({ testimony: true })}
              className="t-questioning-answer-grid__button t-questioning-answer-grid__button--no"
              disabled={!isUserTheWitness || isLoading}
            >
              <Avatar
                size="large"
                icon={<Icons.SpeechBubbleAccepted />}
                style={{ backgroundColor: 'transparent' }}
                shape="square"
              />
              <span className="t-questioning-answer-grid__answer">
                <Translate pt="Sim" en="Yes" />
              </span>
            </Button>
          ) : (
            <div></div>
          )}
        </div>
      </Title>

      <Suspects
        suspects={suspects}
        perpetrator={isUserTheWitness ? perpetrator : undefined}
        eliminatedSuspects={previouslyEliminatedSuspects}
      />

      <QuestionsHistory history={history} />
    </Step>
  );
}
