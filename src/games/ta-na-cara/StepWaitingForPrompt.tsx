// Types
import type { GamePlayers, GamePlayer } from 'types/game';
import type { SuspectCardData, TestimonyStatementCardData } from 'types/tdr';
// Components
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
import { PlayersTurnOrder } from '@components/players/PlayersTurnOrder';
import { Step, type StepProps } from '@components/steps/Step';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { StepTitle } from '@components/text/StepTitle';
// Internal
import { CharactersBoard } from './components/CharactersBoard';
import { QuestionHistory } from './components/QuestionHistory';

type StepWaitingForPromptProps = {
  players: GamePlayers;
  user: GamePlayer;
  turnOrder: TurnOrder;
  characters: SuspectCardData[];
  questionsHistory: TestimonyStatementCardData[];
  activePlayer: GamePlayer;
} & Pick<StepProps, 'announcement'>;

export function StepWaitingForPrompt({
  players,
  user,
  announcement,
  turnOrder,
  characters,
  questionsHistory,
  activePlayer,
}: StepWaitingForPromptProps) {
  const { targetPlayerId, guesserPlayerId } = user;

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle wait>
        <Translate
          pt="Aguarde enquanto {player} decide o que fazer"
          en="Please wait while {player} takes an action"
          values={{
            player: <PlayerAvatarName player={activePlayer} />,
          }}
        />
      </StepTitle>

      <RuleInstruction type="rule">
        <Translate
          en="Every player have a secret character, but your goal is to figure out who is {target}'s secret character, while answering questions about your character to help {guesser} figure out who your secret character is.
          <br/>
          But the question cannot be about their character's physical traits, but about their vibe or
              personality."
          pt="Cada jogador tem um personagem secreto, mas seu objetivo é descobrir quem é o personagem secreto
              de {target}, enquanto responde perguntas sobre seu
              personagem para ajudar  {guesser} a descobrir quem é
              seu personagem secreto."
          values={{
            target: <PlayerAvatarName player={players[targetPlayerId]} />,
            guesser: <PlayerAvatarName player={players[targetPlayerId]} />,
          }}
        />
      </RuleInstruction>

      <SpaceContainer>
        <CharactersBoard
          characters={characters}
          players={players}
          user={user}
          questionsHistory={questionsHistory}
        />
        <QuestionHistory
          players={players}
          questionsHistory={questionsHistory}
          user={user}
        />
      </SpaceContainer>

      <PlayersTurnOrder
        players={players}
        order={turnOrder}
        activePlayerId={activePlayer.id}
        reorderByUser={guesserPlayerId}
      />
    </Step>
  );
}
