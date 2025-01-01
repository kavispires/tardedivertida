// Types
import type { GamePlayers, GamePlayer } from 'types/player';
// Hooks
import { useMock } from 'hooks/useMock';
// Components
import { Translate } from 'components/language';
import { TurnOrder } from 'components/players';
import { Step, type StepProps } from 'components/steps';
import { Instruction, StepTitle } from 'components/text';
// Internal
import type { CharactersDictionary, QuestionsDictionary } from './utils/types';
import { mockPromptDecision } from './utils/mock';
import { CharactersBoard } from './components/CharactersBoard';
import { PlayersBoards } from './components/PlayersBoards';
import { PlayerChoices } from './components/PlayerChoices';
// Mocks

type StepSelectPromptProps = {
  players: GamePlayers;
  user: GamePlayer;
  turnOrder: TurnOrder;
  charactersIds: CardId[];
  charactersDict: CharactersDictionary;
  questionsDict: QuestionsDictionary;
  onSubmitPrompt: GenericFunction;
  onSubmitTarget: GenericFunction;
  activePlayerId: PlayerId;
} & Pick<StepProps, 'announcement'>;

export function StepSelectPrompt({
  players,
  user,
  announcement,
  turnOrder,
  charactersDict,
  charactersIds,
  questionsDict,
  onSubmitPrompt,
  onSubmitTarget,
  activePlayerId,
}: StepSelectPromptProps) {
  // DEV: Auto decision
  useMock(() => {
    mockPromptDecision(user, players, onSubmitPrompt, onSubmitTarget);
  });

  return (
    <Step fullWidth announcement={announcement}>
      <StepTitle>
        <Translate pt={<>Selecione uma das opções</>} en={<>Select one of the options</>} />
      </StepTitle>

      <Instruction contained>
        <Translate
          pt="Escolha uma das opções abaixo lembrando que todos responderam à pergunta que você escolher ou todos tentaram adivinhar quem um jogador é."
          en="Choose one of the options below, remember that everybody will answer the question you choose or everybody will attempt to guess the targeted player."
        />
      </Instruction>

      <PlayerChoices
        players={players}
        user={user}
        questionsDict={questionsDict}
        onSubmitPrompt={onSubmitPrompt}
        onSubmitTarget={onSubmitTarget}
      />

      <PlayersBoards players={players} user={user} questionsDict={questionsDict} />

      <CharactersBoard
        charactersDict={charactersDict}
        charactersIds={charactersIds}
        userCharacterId={user.cardId}
      />

      <TurnOrder players={players} order={turnOrder} activePlayerId={activePlayerId} />
    </Step>
  );
}
