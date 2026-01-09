// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Components
import { PlayerAvatarName } from 'components/avatars';
import { Translate } from 'components/language';
import { TurnOrder } from 'components/players';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
// Internal
import type { WordLength } from './utils/types';
import { ItemsGrid } from './components/ItemsGrid';
import { WordLengths } from './components/WordLengths';

type StepWaitWordCreationProps = {
  players: GamePlayers;
  creator: GamePlayer;
  items: string[];
  wordLengths: WordLength[];
  turnOrder: PlayerId[];
} & Pick<StepProps, 'announcement'>;

export function StepWaitWordCreation({
  players,
  creator,
  announcement,
  items,
  wordLengths,
  turnOrder,
}: StepWaitWordCreationProps) {
  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle wait>
        <Translate
          pt={
            <>
              Aguarde enquanto <PlayerAvatarName player={creator} /> cria a palavra-valise
            </>
          }
          en={
            <>
              Wait while <PlayerAvatarName player={creator} /> creates the new portmanteau
            </>
          }
        />
      </StepTitle>

      <RuleInstruction type="rule">
        <Translate
          en={
            <>
              From the items below, two of them were draft to be the beginning and the end of your new word.
              <br />
              The creator will name them and them use the beginning of one and the end of the other to create
              a new word.
              <br />
              The goal of the group will be to figure out what two items originated the word.
              <br />
              <strong>Shhh! Do not discuss the items!</strong>
            </>
          }
          pt={
            <>
              Dos itens abaixo, dois deles foram escolhidos para ser o começo e o fim da nova palavra.
              <br />O criador irá nomeá-los e então usar o começo de um e o fim do outro para criar uma nova
              palavra.
              <br />O objetivo do grupo é descobrir quais foram os dois itens que originaram a palavra.
              <br />
              <strong>Silêncio! Não discutam os itens!</strong>
            </>
          }
        />
      </RuleInstruction>

      <ItemsGrid
        items={items}
        selectedItems={[]}
      />

      <WordLengths wordLengths={wordLengths} />

      <TurnOrder
        players={players}
        order={turnOrder}
        activePlayerId={creator.id}
      />
    </Step>
  );
}
