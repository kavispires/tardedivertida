// Components
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { CharactersBoard } from './components/CharactersBoard';
import { AvatarName, IconAvatar } from 'components/avatars';
import { PlayersBoards } from './components/PlayersBoards';
import { UserQuestions } from './components/UserQuestions';
// Icons
import { AnimatedClockIcon } from 'icons/AnimatedClockIcon';
import { TurnOrder } from 'components/players';

type StepWaitingForPromptProps = {
  players: GamePlayers;
  user: GamePlayer;
  turnOrder: TurnOrder;
  charactersIds: CardId[];
  charactersDict: CharactersDictionary;
  questionsDict: QuestionsDictionary;
  activePlayer: GamePlayer;
  activePlayerId: PlayerId;
} & AnnouncementProps;

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
