// Ant Design Resources
import { Avatar, Space } from 'antd';
// Types
import type { QuestionsDictionary } from '../utils/types';
// Hooks
import { useLoading } from 'hooks/useLoading';
// Utils
import { LETTERS } from 'utils/constants';
import { getColorFromLetter, sortPlayers } from 'utils/helpers';
// Components
import { AvatarCard } from 'components/avatars';
import { Card } from 'components/cards';
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
import { TransparentButton } from 'components/buttons';

type PlayerChoicesProps = {
  players: GamePlayers;
  user: GamePlayer;
  questionsDict: QuestionsDictionary;
  onSubmitPrompt: GenericFunction;
  onSubmitTarget: GenericFunction;
};

export function PlayerChoices({
  players,
  user,
  questionsDict,
  onSubmitPrompt,
  onSubmitTarget,
}: PlayerChoicesProps) {
  const { isLoading } = useLoading();
  return (
    <Instruction contained>
      <p className="">
        <Avatar size="large">A</Avatar>{' '}
        <strong>
          <Translate
            pt={<>Uma pergunta a ser respondida por todos</>}
            en={<>A question to be answered by everybody</>}
          />
        </strong>
      </p>
      <Space wrap className="questions-container-grid">
        {(user.questions ?? []).length === 0 && (
          <Instruction contained>
            <Translate
              pt="Você não tem mais perguntas disponíveis, então só resta tentar adivinhar"
              en="You don't have available questions, so try to guess who someone is"
            />
          </Instruction>
        )}
        {(user.questions ?? []).map((questionId: CardId, index: number) => {
          return (
            <TransparentButton
              onClick={() => onSubmitPrompt({ questionId })}
              disabled={isLoading || user.ready}
              className="questions-container-grid__button"
            >
              <Card
                key={questionId}
                header={LETTERS[index]}
                color={getColorFromLetter(LETTERS[index])}
                className="questions-container-grid__card"
              >
                {questionsDict[questionId].question}
              </Card>
            </TransparentButton>
          );
        })}
      </Space>
      <p>
        <Avatar size="large">B</Avatar>{' '}
        <strong>
          <Translate
            pt={<>Um jogador para adivinhar quem ele(a) é</>}
            en={<>A player to guess who they are</>}
          />
        </strong>
      </p>
      <Space wrap className="space-container">
        {sortPlayers(players)
          .filter((player) => player.id !== user.id)
          .map((player) => {
            return (
              <TransparentButton
                onClick={() => onSubmitTarget({ targetId: player.id })}
                disabled={isLoading || user.ready}
              >
                <AvatarCard player={player} size="small" withName withRoundCorners />
              </TransparentButton>
            );
          })}
      </Space>
    </Instruction>
  );
}
