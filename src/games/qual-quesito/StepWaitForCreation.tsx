// Types
import type { GamePlayers, GamePlayer } from 'types/player';
import type { Item } from 'types/tdr';
// Components
import { PlayerAvatarName } from 'components/avatars';
import { Translate } from 'components/language';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
// Internal
import { ItemsHand } from './components/ItemsHand';
import { PlayersHandsCounts } from './components/PlayersHandsCounts';
// Hooks

type StepWaitForCreationProps = {
  players: GamePlayers;
  user: GamePlayer;
  cardsDict: Dictionary<Item>;
  creator: GamePlayer;
  turnOrder: GameOrder;
} & Pick<StepProps, 'announcement'>;

export function StepWaitForCreation({
  announcement,
  user,
  cardsDict,
  creator,
  players,
  turnOrder,
}: StepWaitForCreationProps) {
  return (
    <Step fullWidth announcement={announcement}>
      <StepTitle wait>
        <Translate
          pt={
            <>
              Aguarde enquanto <PlayerAvatarName player={creator} /> cria a categoria...
            </>
          }
          en={
            <>
              Wait while <PlayerAvatarName player={creator} /> creates the category...
            </>
          }
        />
      </StepTitle>

      <RuleInstruction type="wait">
        <Translate
          pt={
            <>
              O criator está criando a categoria...
              <br />
              Ele(a) está tentando conectar pelo menos 2 de suas coisas com uma categoria específica.
              <br />A categoria deve ser bem específica para que outros jogadores não consigam adicionar
              coisas facilmente à ela!
              <br />- Categorias não podem ser "meta", do tipo "coisas que os outros jogadores não tem",
              "coisas que comi ontem", etc.
              <br />- Também deve que ser relacionada ao nome da coisa, não à imagem dela. (durante a votação,
              apenas o nome da coisa será mostrado).
            </>
          }
          en={
            <>
              The creator is creating the category...
              <br />
              They are trying to connect at least 2 of their things with a specific category.
              <br />
              The category must be very specific so that other players cannot easily add things to it!
              <br />- Categories can't be "meta", like "things that other players don't have", "things I ate
              yesterday", etc.
              <br />- It must also be related to the name of the thing, not its image. (during voting, only
              the name of the thing will be shown).
            </>
          }
        />
      </RuleInstruction>

      <ItemsHand hand={user.hand ?? []} cardsDict={cardsDict} />

      <PlayersHandsCounts players={players} turnOrder={turnOrder} />
    </Step>
  );
}
