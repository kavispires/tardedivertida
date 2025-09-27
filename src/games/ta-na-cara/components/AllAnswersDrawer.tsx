// Ant Design Resources
import { Badge, Button, Flex, Popconfirm, Popover } from 'antd';
// Types
import type { GamePlayer, GamePlayers } from 'types/player';
import type { TestimonyQuestionCard } from 'types/tdr';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Utils
import { sortPlayers } from 'utils/helpers';
// Icons
import { BoxCheckMarkIcon } from 'icons/BoxCheckMarkIcon';
import { BoxXIcon } from 'icons/BoxXIcon';
// Components
import { AvatarCard, AvatarName, IconAvatar } from 'components/avatars';
import { TransparentButton } from 'components/buttons';
import { Translate } from 'components/language/Translate';
import { RuleInstruction } from 'components/text';
// Internal
import type { Votes } from '../utils/types';
import { clearEliminatedIdentities } from '../utils/store';

type AllAnswersDrawerProps = {
  user: GamePlayer;
  players: GamePlayers;
  grid: CardId[];
  questionsDict: Dictionary<TestimonyQuestionCard>;
  selectedPlayerId: PlayerId | null;
  setSelectedPlayerId: (playerId: PlayerId | null) => void;
  votes: Votes;
};

export function AllAnswersDrawer({
  players,
  grid,
  questionsDict,
  user,
  selectedPlayerId,
  setSelectedPlayerId,
  votes,
}: AllAnswersDrawerProps) {
  const orderedPlayers = sortPlayers(players, undefined, ['asc'], user.id);

  return (
    <>
      <RuleInstruction type="tip">
        <Translate
          pt="Clique em um jogador para ver suas respostas e poder ir eliminando os personagens baseado nas respostas dadas."
          en="Click on a player to see their answers and start eliminating characters based on the answers given."
        />
      </RuleInstruction>
      <Flex justify="space-around" align="center" wrap>
        {orderedPlayers.map((player) => {
          if (player.id !== user.id) {
            return (
              <TransparentButton
                hoverType="tint"
                active={selectedPlayerId === player.id}
                onClick={() => setSelectedPlayerId(player.id)}
                style={{ borderRadius: '8px' }}
              >
                <PlayerEntry
                  key={player.id}
                  player={player}
                  questionsDict={questionsDict}
                  grid={grid}
                  isUser={player.id === user.id}
                  eliminations={votes?.[player.id]?.eliminated}
                />
              </TransparentButton>
            );
          }

          return (
            <PlayerEntry
              key={player.id}
              player={player}
              questionsDict={questionsDict}
              grid={grid}
              isUser={player.id === user.id}
              eliminations={votes?.[player.id]?.eliminated}
            />
          );
        })}
      </Flex>

      <Flex className="mt-2" gap={6}>
        <Popconfirm
          title={
            <>
              <Translate
                pt="Tem certeza que deseja limpar as seleções?"
                en="Are you sure you want to clear the selections?"
              />
              {selectedPlayerId && (
                <>
                  <Translate pt="para:" en="for:" />{' '}
                  <AvatarName player={players[selectedPlayerId]} size="small" />
                </>
              )}
            </>
          }
          onConfirm={() => {
            if (selectedPlayerId) {
              clearEliminatedIdentities(selectedPlayerId);
            }
          }}
        >
          <Button ghost disabled={!selectedPlayerId} size="small">
            <Translate pt="Limpar seleções" en="Clear selections" />
            {selectedPlayerId && (
              <>
                <Translate pt="para:" en="for:" />{' '}
                <AvatarName player={players[selectedPlayerId]} size="small" />
              </>
            )}
          </Button>
        </Popconfirm>
      </Flex>
    </>
  );
}

type PlayerEntryProps = {
  player: GamePlayer;
  questionsDict: Dictionary<TestimonyQuestionCard>;
  grid: CardId[];
  isUser?: boolean;
  eliminations?: BooleanDictionary;
};

function PlayerEntry({ player, isUser, questionsDict, grid, eliminations = {} }: PlayerEntryProps) {
  const { translate } = useLanguage();
  const identity = player.identity;
  const answers: BooleanDictionary = identity.answers;
  const remainingCharacters =
    Object.keys(grid).length - 1 - Object.values(eliminations).filter(Boolean).length;

  const content = (
    <Flex vertical>
      {Object.entries(answers).map(([questionId, answer]) => {
        const question = questionsDict[questionId];
        return (
          <Flex key={questionId} justify="space-between">
            <span>{question.question}</span>
            <IconAvatar size="small" icon={answer ? <BoxCheckMarkIcon /> : <BoxXIcon />} />
          </Flex>
        );
      })}
      {Object.entries(answers).length === 0 && (
        <span>
          <i>
            <Translate pt="Nenhuma resposta dada ainda" en="No answers given yet" />
          </i>
        </span>
      )}
    </Flex>
  );

  return (
    <Popover
      content={content}
      title={
        <>
          <Translate pt="Respostas dadas por " en="Answers given by " /> <AvatarName player={player} />
        </>
      }
    >
      <Badge
        count={isUser ? translate('Você', 'You') : remainingCharacters}
        showZero={!isUser}
        size="small"
        offset={[-16, 0]}
        color={remainingCharacters === 1 ? 'green' : '#8f8f8f'}
      >
        <Flex vertical className="ta-na-cara-grouped-answers" align="center" justify="center">
          <AvatarCard player={player} size="small" withName withRoundCorners />
        </Flex>
      </Badge>
    </Popover>
  );
}
