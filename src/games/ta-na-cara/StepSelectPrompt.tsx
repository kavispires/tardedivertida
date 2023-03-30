// Hooks
import { useDelayedMock } from 'hooks/useMock';
// Mocks
import { mockPromptDecision } from './utils/mock';
// Components
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { CharactersBoard } from './components/CharactersBoard';
import { PlayersBoards } from './components/PlayersBoards';
import { PlayerChoices } from './components/PlayerChoices';
import { TurnOrder } from 'components/players';

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
} & AnnouncementProps;

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
  useDelayedMock(() => {
    mockPromptDecision(user, players, onSubmitPrompt, onSubmitTarget);
  });

  return (
    <Step fullWidth announcement={announcement}>
      <Title size="medium">
        <Translate pt={<>Selecione uma das opções</>} en={<>Select one of the options</>} />
      </Title>

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
