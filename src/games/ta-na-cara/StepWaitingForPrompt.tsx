// Types
import type { GamePlayers, GamePlayer } from 'types/player';
// Icons
import { AnimatedClockIcon } from 'icons/AnimatedClockIcon';
// Components
import { AvatarName, IconAvatar } from 'components/avatars';
import { Translate } from 'components/language';
import { TurnOrder } from 'components/players';
import { Step, type StepProps } from 'components/steps';
import { Instruction, Title } from 'components/text';
// Internal
import type { CharactersDictionary, QuestionsDictionary } from './utils/types';
import { CharactersBoard } from './components/CharactersBoard';
import { PlayersBoards } from './components/PlayersBoards';
import { UserQuestions } from './components/UserQuestions';

type StepWaitingForPromptProps = {
  players: GamePlayers;
  user: GamePlayer;
  turnOrder: TurnOrder;
  charactersIds: CardId[];
  charactersDict: CharactersDictionary;
  questionsDict: QuestionsDictionary;
  activePlayer: GamePlayer;
  activePlayerId: PlayerId;
} & Pick<StepProps, 'announcement'>;

export function StepWaitingForPrompt({
  players,
  user,
  announcement,
  charactersDict,
  charactersIds,
  activePlayer,
  turnOrder,
  questionsDict,
  activePlayerId,
}: StepWaitingForPromptProps) {
  return (
    <Step fullWidth announcement={announcement}>
      <Title size="medium">
        <IconAvatar icon={<AnimatedClockIcon />} />
        <Translate
          pt={
            <>
              Aguarde enquanto <AvatarName player={activePlayer} /> decide o que fazer
            </>
          }
          en={
            <>
              Please wait while <AvatarName player={activePlayer} /> takes an action
            </>
          }
        />
      </Title>

      <Instruction contained>
        <Translate
          pt="Cada jogador é uma das figuras abaixo. Você consegue adivinhar quem é quem?"
          en="Each player is one of the figures below. Can you guess who is who?"
        />
      </Instruction>

      <CharactersBoard
        charactersDict={charactersDict}
        charactersIds={charactersIds}
        userCharacterId={user.cardId}
      />

      <PlayersBoards players={players} user={user} questionsDict={questionsDict} />

      <TurnOrder players={players} order={turnOrder} activePlayerId={activePlayerId} />

      <UserQuestions questionsDict={questionsDict} user={user} />
    </Step>
  );
}
