// Types
import type { GamePlayer, GamePlayers } from 'types/game';
// Components
import { Card } from 'components/cards/Card';
import { Translate } from 'components/language/Translate';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { TurnOrder } from 'components/players/TurnOrder';
import { Step, type StepProps } from 'components/steps/Step';
import { StepTitle } from 'components/text/StepTitle';
// Internal
import type { WordLength } from './utils/types';
import { ItemsGrid } from './components/ItemsGrid';
import { WordLengths } from './components/WordLengths';

type StepWaitGuessingProps = {
  players: GamePlayers;
  creator: GamePlayer;
  turnOrder: UID[];
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
