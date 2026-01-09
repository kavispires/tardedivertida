// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Components
import { Card } from 'components/cards';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { TurnOrder } from 'components/players';
import { Step, type StepProps } from 'components/steps';
import { StepTitle } from 'components/text';
// Internal
import type { WordLength } from './utils/types';
import { ItemsGrid } from './components/ItemsGrid';
import { WordLengths } from './components/WordLengths';

type StepWaitGuessingProps = {
  players: GamePlayers;
  creator: GamePlayer;
  turnOrder: PlayerId[];
  items: string[];
  wordLengths: WordLength[];
  newWord: string;
  beginsWith: string;
  endsWith: string;
} & Pick<StepProps, 'announcement'>;

export function StepWaitGuessing({
  players,
  creator,
  turnOrder,
  announcement,
  items,
  wordLengths,
  newWord,
  beginsWith,
  endsWith,
}: StepWaitGuessingProps) {
  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle wait>
        <Translate
          pt={<>Aguarde enquanto os jogadores adivinham os itens que criaram a palavra-valise</>}
          en={<>Wait while the players guess the items that created the portmanteau</>}
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

      <ItemsGrid
        items={items}
        targets={[beginsWith, endsWith]}
      />

      <WordLengths
        wordLengths={wordLengths}
        highlightLength={newWord.length}
      />

      <TurnOrder
        players={players}
        order={turnOrder}
        activePlayerId={creator.id}
      />
    </Step>
  );
}
