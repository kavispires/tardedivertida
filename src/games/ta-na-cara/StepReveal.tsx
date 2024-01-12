// Ant Design Resources
import { Space } from 'antd';
// Types
import type { GamePlayers, GamePlayer } from 'types/player';
import type { CharactersDictionary, QuestionsDictionary } from './utils/types';
import type { UseStep } from 'hooks/useStep';
// Utils
import { pluralize } from 'utils/helpers';
// Components
import { Step, type StepProps } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { CharactersBoard } from './components/CharactersBoard';
import { PlayerBoard } from './components/PlayersBoards';
import { TurnOrder } from 'components/players';
import { AvatarName } from 'components/avatars';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
import { ViewOr } from 'components/views';
import { ListOfPlayers } from 'components/players/ListOfPlayers';
import { TimedButton } from 'components/buttons';

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
      <Title size="medium">
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
      </Title>

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

          <>
            <Translate
              pt={
                <>
                  A identidade de <AvatarName player={targetedPlayer} /> permanecerá desconhecida. Jogadores
                  podem tentar adivinhar novamente na próxima rodada.
                </>
              }
              en={
                <>
                  The identity remains unknown for <AvatarName player={targetedPlayer} />. Players may try
                  again next round.
                </>
              }
            />
          </>
        </ViewOr>
      </Instruction>

      <Space className="space-container">
        {Boolean(result) && (
          <PlayerBoard
            player={result!}
            cardWidth={100}
            questionsDict={questionsDict}
            userCharacterId={result!.characterId}
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
