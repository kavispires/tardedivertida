// Ant Design Resources
import { TrophyOutlined } from '@ant-design/icons';
// Types
import type { GamePlayers, GamePlayer } from 'types/game';
// Hooks
import type { UseStep } from 'hooks/useStep';
// Utils
import { pluralize } from 'utils/helpers';
// Components
import { TimedButton } from 'components/buttons/TimedButton';
import { Translate } from 'components/language/Translate';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
import { PlayerAvatarName } from 'components/player/PlayerAvatarName';
import { ListOfPlayers } from 'components/players/ListOfPlayers';
import { TurnOrder } from 'components/players/TurnOrder';
import { Step, type StepProps } from 'components/steps/Step';
import { Instruction } from 'components/text/Instruction';
import { StepTitle } from 'components/text/StepTitle';
import { ViewIf } from 'components/views/ViewIf';
// Internal
import type { CharactersDictionary, QuestionsDictionary } from './utils/types';
import { CharactersBoard } from './components/CharactersBoard';
import { PlayerBoard } from './components/PlayersBoards';

type StepRevealProps = {
  players: GamePlayers;
  user: GamePlayer;
  turnOrder: TurnOrder;
  charactersIds: UID[];
  charactersDict: CharactersDictionary;
  questionsDict: QuestionsDictionary;
  targetedPlayer: GamePlayer;
  activePlayerId: UID;
  points: number;
  correct: UID[];
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
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle>
        <ViewIf condition={isCorrect}>
          <Translate
            pt={
              <>
                <PlayerAvatarName player={targetedPlayer} /> foi revelado!
              </>
            }
            en={
              <>
                <PlayerAvatarName player={targetedPlayer} /> was revealed!
              </>
            }
          />
        </ViewIf>
        <ViewIf condition={!isCorrect}>
          <Translate
            pt="Vixi, ninguém acertou"
            en="Oh no! Nobody got it right"
          />
        </ViewIf>
      </StepTitle>

      <Instruction contained>
        <ViewIf condition={isCorrect}>
          <>
            <ListOfPlayers
              players={players}
              list={correct}
              prefix="winners"
            />
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
        </ViewIf>
        <ViewIf condition={!isCorrect}>
          <Translate
            pt={
              <>
                A identidade de <PlayerAvatarName player={targetedPlayer} /> permanecerá desconhecida.
                Jogadores podem tentar adivinhar novamente na próxima rodada.
              </>
            }
            en={
              <>
                The identity remains unknown for <PlayerAvatarName player={targetedPlayer} />. Players may try
                again next round.
              </>
            }
          />
        </ViewIf>
      </Instruction>

      {!!result && (
        <SpaceContainer>
          <PlayerBoard
            player={result}
            cardWidth={100}
            questionsDict={questionsDict}
            userCharacterId={result.characterId}
          />
        </SpaceContainer>
      )}

      <CharactersBoard
        charactersDict={charactersDict}
        charactersIds={charactersIds}
        userCharacterId={user.cardId}
      />

      <SpaceContainer align="center">
        <TimedButton
          duration={isCorrect ? 15 : 7}
          onExpire={goToNextStep}
          onClick={goToNextStep}
          icon={<TrophyOutlined />}
        >
          <Translate
            pt="Ver Ranking"
            en="See Ranking"
          />
        </TimedButton>
      </SpaceContainer>

      <TurnOrder
        players={players}
        order={turnOrder}
        activePlayerId={activePlayerId}
      />
    </Step>
  );
}
