// Ant Design Resources
import { Avatar, Button } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Icons
import { SpeechBubbleAcceptedIcon } from 'icons/SpeechBubbleAcceptedIcon';
import { SpeechBubbleDeclinedIcon } from 'icons/SpeechBubbleDeclinedIcon';
// Components
import { Suspects } from './components/Suspects';
import { QuestionsHistory } from './components/QuestionsHistory';
import { Step } from 'components/steps';
import { Title } from 'components/text';
import { Translate } from 'components/language';
import { AvatarName } from 'components/avatars';
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
} & AnnouncementProps;

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
                icon={<SpeechBubbleDeclinedIcon />}
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
                icon={<SpeechBubbleAcceptedIcon />}
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

      {history.length > 0 && <QuestionsHistory history={history} />}
    </Step>
  );
}
