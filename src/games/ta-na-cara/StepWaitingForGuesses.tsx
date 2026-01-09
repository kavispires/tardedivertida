// Types
import type { GamePlayers, GamePlayer } from 'types/player';
// Icons
import { AnimatedClockIcon } from 'icons/AnimatedClockIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { Translate } from 'components/language';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
import { TurnOrder } from 'components/players';
import { Step, type StepProps } from 'components/steps';
import { Instruction, StepTitle } from 'components/text';
// Internal
import type { CharactersDictionary, QuestionsDictionary } from './utils/types';
import { CharactersBoard } from './components/CharactersBoard';
import { PlayersBoards } from './components/PlayersBoards';

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
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle>
        <IconAvatar icon={<AnimatedClockIcon />} />
        <Translate
          pt={<>Aguarde enquanto os jogadores tentam adivinhar quem você é</>}
          en={<>Please wait while the other players try to guess who you are</>}
        />
      </StepTitle>

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

      <PlayersBoards
        players={players}
        user={user}
        questionsDict={questionsDict}
      />

      <TurnOrder
        players={players}
        order={turnOrder}
        activePlayerId={activePlayerId}
      />
    </Step>
  );
}
