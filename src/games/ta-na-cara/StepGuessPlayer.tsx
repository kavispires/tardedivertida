import { useMemo, useState } from 'react';
// Ant Design Resources
import { Select } from 'antd';
// Types
import type { GamePlayers, GamePlayer } from 'types/game';
import type { SuspectCardData, TestimonyStatementCardData } from 'types/tdr';
// Components
import { SendButton } from '@components/buttons/SendButton';
import { DualTranslate } from '@components/language/DualTranslate';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { Step, type StepProps } from '@components/steps/Step';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { StepTitle } from '@components/text/StepTitle';
// Internal
import type { SubmitGuessPayload } from './utils/types';
import { useCharacterEliminationCache } from './utils/useCharacterEliminationCache';
import { CharactersBoard } from './components/CharactersBoard';
import { QuestionHistory } from './components/QuestionHistory';

type StepGuessPlayerProps = {
  players: GamePlayers;
  user: GamePlayer;
  turnOrder: TurnOrder;
  characters: SuspectCardData[];
  questionsHistory: TestimonyStatementCardData[];
  onSubmitGuess: (payload: SubmitGuessPayload) => void;
} & Pick<StepProps, 'announcement'>;

export function StepGuessPlayer({
  players,
  user,
  announcement,
  characters,
  questionsHistory,
  onSubmitGuess,
}: StepGuessPlayerProps) {
  const [guess, setGuess] = useState<UID | null>(null);
  const { inferredEliminations } = useCharacterEliminationCache();

  const nonEliminatedCharacterOptions = useMemo(() => {
    return characters
      .filter((character) => !inferredEliminations[character.id] && character.id !== user.secretCharacterId)
      .map((character) => ({
        label: <DualTranslate>{character.name}</DualTranslate>,
        value: character.id,
      }));
  }, [characters, inferredEliminations, user.secretCharacterId]);

  // useMock(() => {
  //   onSubmitGuess({ characterId: mockGuess(charactersDict, user, targetedPlayer.id) });
  // });

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle>
        <Translate
          pt="Quem é esse jogador?"
          en="Who is this player?"
        />
      </StepTitle>

      <RuleInstruction type="action">
        <Translate
          pt={<>Analise as respostas e selecione a pessoa que você acha que seu oponente é.</>}
          en={<>Analyze the answers and select who you think your opponent is.</>}
        />
      </RuleInstruction>

      <SpaceContainer>
        <Select
          size="large"
          options={nonEliminatedCharacterOptions}
          style={{ minWidth: 256 }}
          onChange={(value) => setGuess(value)}
          placeholder={
            <Translate
              pt="Selecione um personagem"
              en="Select a character"
            />
          }
        />

        <SendButton
          size="large"
          disabled={!guess}
          onClick={() => onSubmitGuess({ characterId: guess ?? '' })}
        >
          <Translate
            pt="Enviar palpite"
            en="Submit guess"
          />
        </SendButton>
      </SpaceContainer>

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
    </Step>
  );
}
