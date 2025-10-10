// Ant Design Resources
import { Avatar, Space } from 'antd';
// Types
import type { GamePlayers, GamePlayer } from 'types/player';
// Hooks
import { useLoading } from 'hooks/useLoading';
// Utils
import { LETTERS } from 'utils/constants';
import { getColorFromLetter, sortPlayers } from 'utils/helpers';
// Components
import { PlayerAvatarCard } from 'components/avatars';
import { TransparentButton } from 'components/buttons';
import { Card } from 'components/cards';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { Instruction } from 'components/text';
// Internal
import type { QuestionsDictionary } from '../utils/types';

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
              key={questionId}
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
      <SpaceContainer wrap>
        {sortPlayers(players)
          .filter((player) => player.id !== user.id)
          .map((player) => {
            return (
              <TransparentButton
                key={player.id}
                onClick={() => onSubmitTarget({ targetId: player.id })}
                disabled={isLoading || user.ready}
              >
                <PlayerAvatarCard player={player} size="small" withName withRoundCorners />
              </TransparentButton>
            );
          })}
      </SpaceContainer>
    </Instruction>
  );
}
