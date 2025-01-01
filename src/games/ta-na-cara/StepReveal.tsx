// Ant Design Resources
import { Space } from 'antd';
// Types
import type { GamePlayers, GamePlayer } from 'types/player';
// Hooks
import type { UseStep } from 'hooks/useStep';
// Utils
import { pluralize } from 'utils/helpers';
// Components
import { AvatarName } from 'components/avatars';
import { TimedButton } from 'components/buttons';
import { Translate } from 'components/language';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
import { TurnOrder } from 'components/players';
import { ListOfPlayers } from 'components/players/ListOfPlayers';
import { Step, type StepProps } from 'components/steps';
import { Instruction, StepTitle } from 'components/text';
import { ViewOr } from 'components/views';
// Internal
import type { CharactersDictionary, QuestionsDictionary } from './utils/types';
import { CharactersBoard } from './components/CharactersBoard';
import { PlayerBoard } from './components/PlayersBoards';

type StepRevealProps = {
  players: GamePlayers;
  user: GamePlayer;
  turnOrder: TurnOrder;
  charactersIds: CardId[];
  charactersDict: CharactersDictionary;
  questionsDict: QuestionsDictionary;
  targetedPlayer: GamePlayer;
  activePlayerId: PlayerId;
  points: number;
  correct: PlayerId[];
  goToNextStep: UseStep['goToNextStep'];
  result: GamePlayer | null;
} & Pick<StepProps, 'announcement'>;

export function StepReveal({
  players,
  user,
  announcement,
  turnOrder,
  charactersDict,
  charactersIds,
  targetedPlayer,
  questionsDict,
  points,
  correct,
  activePlayerId,
  goToNextStep,
  result,
}: StepRevealProps) {
  const isCorrect = correct.length > 0;

  return (
    <Step fullWidth announcement={announcement}>
      <StepTitle>
        <ViewOr condition={isCorrect}>
          <Translate
            pt={
              <>
                <AvatarName player={targetedPlayer} /> foi revelado!
              </>
            }
            en={
              <>
                <AvatarName player={targetedPlayer} /> was revealed!
              </>
            }
          />

          <Translate pt="Vixi, ninguém acertou" en="Oh no! Nobody got it right" />
        </ViewOr>
      </StepTitle>

      <Instruction contained>
        <ViewOr condition={isCorrect}>
          <>
            <ListOfPlayers players={players} list={correct} prefix="winners" />
            <Translate
              pt={
                <>
                  acertaram e ganharam{' '}
                  <PointsHighlight>
                    {points} {pluralize(points, 'ponto')}
                  </PointsHighlight>
                  !
                </>
              }
              en={
                <>
                  got it right and got
                  <PointsHighlight>
                    {points} {pluralize(points, 'point')}
                  </PointsHighlight>
                </>
              }
            />
          </>

          <Translate
            pt={
              <>
                A identidade de <AvatarName player={targetedPlayer} /> permanecerá desconhecida. Jogadores
                podem tentar adivinhar novamente na próxima rodada.
              </>
            }
            en={
              <>
                The identity remains unknown for <AvatarName player={targetedPlayer} />. Players may try again
                next round.
              </>
            }
          />
        </ViewOr>
      </Instruction>

      <Space className="space-container">
        {!!result && (
          <PlayerBoard
            player={result}
            cardWidth={100}
            questionsDict={questionsDict}
            userCharacterId={result.characterId}
          />
        )}
      </Space>

      <CharactersBoard
        charactersDict={charactersDict}
        charactersIds={charactersIds}
        userCharacterId={user.cardId}
      />

      <Space className="space-container" align="center">
        <TimedButton duration={isCorrect ? 15 : 7} onExpire={goToNextStep} onClick={goToNextStep}>
          <Translate pt="Ver Ranking" en="See Ranking" />
        </TimedButton>
      </Space>

      <TurnOrder players={players} order={turnOrder} activePlayerId={activePlayerId} />
    </Step>
  );
}
