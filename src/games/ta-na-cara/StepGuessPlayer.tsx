// Types
import type { GamePlayers, GamePlayer } from 'types/player';
// Hooks
import { useMock } from 'hooks/useMock';
// Utils
import { pluralize } from 'utils/helpers';
// Components
import { PlayerAvatarName } from 'components/avatars';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
import { TurnOrder } from 'components/players';
import { Step, type StepProps } from 'components/steps';
import { Instruction, StepTitle } from 'components/text';
// Internal
import type { CharactersDictionary, QuestionsDictionary } from './utils/types';
import { mockGuess } from './utils/mock';
import { CharactersBoard } from './components/CharactersBoard';
import { PlayerBoard } from './components/PlayersBoards';

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
} & Pick<StepProps, 'announcement'>;

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
  useMock(() => {
    onSubmitGuess({ characterId: mockGuess(charactersDict, user, targetedPlayer.id) });
  });

  return (
    <Step fullWidth announcement={announcement}>
      <StepTitle>
        <Translate pt="Quem é esse jogador?" en="Who is this player?" />
      </StepTitle>

      <Instruction contained>
        <Translate
          pt={
            <>
              Analise as respostas e selecione a pessoa que você acha que é{' '}
              <PlayerAvatarName player={targetedPlayer} />. Se você acertar, você ganha{' '}
              <PointsHighlight>
                {points} {pluralize(points, 'ponto')}
              </PointsHighlight>
              . Clique na foto para votar.
            </>
          }
          en={
            <>
              Analyze the answer and select the character you think{' '}
              <PlayerAvatarName player={targetedPlayer} /> is. If you're correct you get{' '}
              <PointsHighlight>
                {points} {pluralize(points, 'point')}
              </PointsHighlight>
              . Click on the picture to vote.
            </>
          }
        />
      </Instruction>

      <SpaceContainer>
        <PlayerBoard
          player={targetedPlayer}
          cardWidth={100}
          questionsDict={questionsDict}
          history={user.history?.[targetedPlayer.id]}
        />
      </SpaceContainer>

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
