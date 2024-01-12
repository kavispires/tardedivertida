// Types
import type { GamePlayers, GamePlayer } from 'types/player';
import type { CharactersDictionary, QuestionsDictionary } from './utils/types';
// Icons
import { AnimatedClockIcon } from 'icons/AnimatedClockIcon';
// Components
import { Step, type StepProps } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { CharactersBoard } from './components/CharactersBoard';
import { IconAvatar } from 'components/avatars';
import { PlayersBoards } from './components/PlayersBoards';
import { TurnOrder } from 'components/players';
import { PointsHighlight } from 'components/metrics/PointsHighlight';

type StepWaitingForGuessesProps = {
  players: GamePlayers;
  user: GamePlayer;
  turnOrder: TurnOrder;
  charactersIds: CardId[];
  charactersDict: CharactersDictionary;
  questionsDict: QuestionsDictionary;
  activePlayerId: PlayerId;
} & Pick<StepProps, 'announcement'>;

export function StepWaitingForGuesses({
  players,
  user,
  announcement,
  charactersDict,
  charactersIds,
  turnOrder,
  questionsDict,
  activePlayerId,
}: StepWaitingForGuessesProps) {
  return (
    <Step fullWidth announcement={announcement}>
      <Title size="medium">
        <IconAvatar icon={<AnimatedClockIcon />} />
        <Translate
          pt={<>Aguarde enquanto os jogadores tentam adivinhar quem você é</>}
          en={<>Please wait while the other players try to guess who you are</>}
        />
      </Title>

      <Instruction contained>
        <Translate
          pt={
            <>
              Você ganha <PointsHighlight>1 ponto</PointsHighlight> por cada jogador que acertar.
            </>
          }
          en={
            <>
              You get <PointsHighlight>1 point</PointsHighlight> for each player who gets it correctly.
            </>
          }
        />
      </Instruction>

      <CharactersBoard
        charactersDict={charactersDict}
        charactersIds={charactersIds}
        userCharacterId={user.cardId}
      />

      <PlayersBoards players={players} user={user} questionsDict={questionsDict} />

      <TurnOrder players={players} order={turnOrder} activePlayerId={activePlayerId} />
    </Step>
  );
}
