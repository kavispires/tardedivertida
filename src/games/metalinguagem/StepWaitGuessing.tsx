// Types
import type { GamePlayer, GamePlayers } from 'types/game';
import type { ItemData } from 'types/tdr';
// Components
import { TextCard } from '@components/cards/TextCard';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { PlayersTurnOrder } from '@components/players/PlayersTurnOrder';
import { Step, type StepProps } from '@components/steps/Step';
import { StepTitle } from '@components/text/StepTitle';
// Internal
import type { WordLength } from './utils/types';
import { ItemsGrid } from './components/ItemsGrid';
import { WordLengths } from './components/WordLengths';

type StepWaitGuessingProps = {
  players: GamePlayers;
  creator: GamePlayer;
  turnOrder: UID[];
  items: ItemData[];
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
        <TextCard size="large">{newWord}</TextCard>
      </SpaceContainer>

      <ItemsGrid
        items={items}
        targets={[beginsWith, endsWith]}
      />

      <WordLengths
        wordLengths={wordLengths}
        highlightLength={newWord.length}
      />

      <PlayersTurnOrder
        players={players}
        order={turnOrder}
        activePlayerId={creator.id}
      />
    </Step>
  );
}
