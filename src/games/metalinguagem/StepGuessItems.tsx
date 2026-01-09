// Types
import type { GamePlayers, GamePlayer } from 'types/player';
// Hooks
import { useBooleanDictionary } from 'hooks/useBooleanDictionary';
import { useMock } from 'hooks/useMock';
// Components
import { SendButton } from 'components/buttons';
import { Card } from 'components/cards';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle, TextHighlight } from 'components/text';
// Internal
import type { SubmitGuessesPayload, WordLength } from './utils/types';
import { mockGuess } from './utils/mock';
import { ItemsGrid } from './components/ItemsGrid';
import { WordLengths } from './components/WordLengths';
// Hooks

type StepGuessItemsProps = {
  players: GamePlayers;
  user: GamePlayer;
  items: string[];
  wordLengths: WordLength[];
  newWord: string;
  onSubmitGuesses: (payload: SubmitGuessesPayload) => void;
  beginsWith: string;
  endsWith: string;
} & Pick<StepProps, 'announcement'>;

export function StepGuessItems({
  announcement,
  items,
  wordLengths,
  newWord,
  onSubmitGuesses,
  beginsWith,
  endsWith,
}: StepGuessItemsProps) {
  const { dict, updateDict } = useBooleanDictionary({});

  const selectedItems = Object.keys(dict);

  const isComplete = selectedItems.length === 2;

  useMock(() => {
    onSubmitGuesses({ guesses: mockGuess(items, beginsWith, endsWith) });
  });

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle>
        <Translate
          pt={
            <>
              Selecione os <TextHighlight>2</TextHighlight> itens que compõem a palavra-valise:
            </>
          }
          en={
            <>
              Select the <TextHighlight>2</TextHighlight> items that compose the portmanteau:
            </>
          }
        />
      </StepTitle>

      <SpaceContainer>
        <Card
          size="large"
          hideHeader
        >
          {newWord}
        </Card>
      </SpaceContainer>

      <RuleInstruction type="rule">
        <Translate
          en={<>The two most voted items will determine if the group successfully guessed the word origin.</>}
          pt={<>Os dois itens mais votados determinarão se o grupo acertou a origem da palavra.</>}
        />
      </RuleInstruction>

      <ItemsGrid
        items={items}
        targets={[]}
        selectedItems={selectedItems}
        onItemSelect={updateDict}
      />

      <SendButton
        disabled={!isComplete}
        onClick={() => onSubmitGuesses({ guesses: selectedItems })}
        size="large"
      >
        <Translate
          en="Submit"
          pt="Enviar"
        />
      </SendButton>

      <WordLengths
        wordLengths={wordLengths}
        highlightLength={newWord.length}
      />
    </Step>
  );
}
