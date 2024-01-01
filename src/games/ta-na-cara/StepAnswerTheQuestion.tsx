// Ant Design Resources
import { Space } from 'antd';
// Types
import type { CharactersDictionary, QuestionsDictionary } from './utils/types';
// Hooks
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Utils
import { mockAnswer } from './utils/mock';
// Icons
import { SpeechBubbleAcceptedIcon } from 'icons/SpeechBubbleAcceptedIcon';
import { SpeechBubbleDeclinedIcon } from 'icons/SpeechBubbleDeclinedIcon';
// Components
import { Step } from 'components/steps';
import { Title } from 'components/text';
import { Translate } from 'components/language';
import { CharactersBoard } from './components/CharactersBoard';
import { PlayerBoard } from './components/PlayersBoards';
import { TurnOrder } from 'components/players';
import { TransparentButton } from 'components/buttons';
import { IconAvatar } from 'components/avatars';
import { ViewIf } from 'components/views';

type StepAnswerTheQuestionProps = {
  players: GamePlayers;
  user: GamePlayer;
  turnOrder: TurnOrder;
  charactersIds: CardId[];
  charactersDict: CharactersDictionary;
  questionId: CardId;
  questionsDict: QuestionsDictionary;
  onSubmitAnswer: GenericFunction;
  activePlayerId: PlayerId;
} & AnnouncementProps;

export function StepAnswerTheQuestion({
  players,
  user,
  announcement,
  turnOrder,
  charactersDict,
  charactersIds,
  questionId,
  questionsDict,
  onSubmitAnswer,
  activePlayerId,
}: StepAnswerTheQuestionProps) {
  const { isLoading } = useLoading();

  // Dev Mock
  useMock(() => {
    onSubmitAnswer({ answer: mockAnswer() });
  });

  return (
    <Step fullWidth announcement={announcement}>
      <Title size="medium">
        <Translate pt="Responda:" en="Please answer:" />
      </Title>

      <div className="answer-board">
        <PlayerBoard
          player={user}
          cardWidth={100}
          userCharacterId={user.characterId}
          questionsDict={questionsDict}
        />
        <div className="answer-board__text">
          <Title size="x-small" level={3} className="answer-board__question">
            {questionsDict[questionId].question}
          </Title>

          <Space>
            <ViewIf condition={user.currentAnswer === undefined || user.currentAnswer === true}>
              <TransparentButton
                className="answer-board__button answer-board__button--yes"
                disabled={user.ready || isLoading}
                onClick={() => onSubmitAnswer({ answer: true })}
              >
                <IconAvatar icon={<SpeechBubbleAcceptedIcon />} size="large" />
                <Translate pt="Sim" en="Yes" />
              </TransparentButton>
            </ViewIf>
            <ViewIf condition={user.currentAnswer === undefined || user.currentAnswer === false}>
              <TransparentButton
                className="answer-board__button answer-board__button--no"
                disabled={user.ready || isLoading}
                onClick={() => onSubmitAnswer({ answer: false })}
              >
                <IconAvatar icon={<SpeechBubbleDeclinedIcon />} size="large" /> <Translate pt="Não" en="No" />
              </TransparentButton>
            </ViewIf>
          </Space>
        </div>
      </div>

      <CharactersBoard
        charactersDict={charactersDict}
        charactersIds={charactersIds}
        userCharacterId={user.cardId}
      />

      <TurnOrder players={players} order={turnOrder} activePlayerId={activePlayerId} />
    </Step>
  );
}
