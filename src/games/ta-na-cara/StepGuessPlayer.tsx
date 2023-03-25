// Ant Design Resources
// Hooks
// Components
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { CharactersBoard } from './components/CharactersBoard';
import { PlayerBoard } from './components/PlayersBoards';
import { TurnOrder } from 'components/players';
import { Space } from 'antd';
import { AvatarName } from 'components/avatars';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
import { pluralize } from 'utils/helpers';
import { useDelayedMock } from 'hooks/useMock';
import { mockGuess } from './utils/mock';

type StepGuessPlayerProps = {
  players: GamePlayers;
  user: GamePlayer;
  turnOrder: TurnOrder;
  charactersIds: CardId[];
  charactersDict: CharactersDictionary;
  questionsDict: QuestionsDictionary;
  onSubmitGuess: GenericFunction;
  targetedPlayer: GamePlayer;
  activePlayerId: PlayerId;
  points: number;
} & AnnouncementProps;

export function StepGuessPlayer({
  players,
  user,
  announcement,
  turnOrder,
  charactersDict,
  charactersIds,
  targetedPlayer,
  questionsDict,
  onSubmitGuess,
  activePlayerId,
  points,
}: StepGuessPlayerProps) {
  useDelayedMock(() => {
    onSubmitGuess({ characterId: mockGuess(charactersDict, user) });
  });

  return (
    <Step fullWidth announcement={announcement}>
      <Title size="medium">
        <Translate pt="Quem é esse jogador?" en="Who is this player?" />
      </Title>

      <Instruction contained>
        <Translate
          pt={
            <>
              Analise as respostas e selecione a pessoa que você acha que é{' '}
              <AvatarName player={targetedPlayer} />. Se você acertar, você ganha{' '}
              <PointsHighlight>
                {points} {pluralize(points, 'ponto')}
              </PointsHighlight>
              . Clique na foto para votar.
            </>
          }
          en={
            <>
              Analyze the answer and select the character you think <AvatarName player={targetedPlayer} /> is.
              If you're correct you get{' '}
              <PointsHighlight>
                {points} {pluralize(points, 'point')}
              </PointsHighlight>
              . Click on the picture to vote.
            </>
          }
        />
      </Instruction>

      <Space className="space-container">
        <PlayerBoard
          player={targetedPlayer}
          cardWidth={100}
          questionsDict={questionsDict}
          history={user.history?.[targetedPlayer.id]}
        />
      </Space>

      <CharactersBoard
        charactersDict={charactersDict}
        charactersIds={charactersIds}
        userCharacterId={user.characterId}
        onCardClick={onSubmitGuess}
        historyEntry={user.history?.[targetedPlayer.id]}
      />

      <TurnOrder players={players} order={turnOrder} activePlayerId={activePlayerId} />
    </Step>
  );
}
