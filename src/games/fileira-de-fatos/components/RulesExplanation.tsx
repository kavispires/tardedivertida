// Components
import { Translate } from 'components/language';
import { TextHighlight } from 'components/text';

export function FirstRoundIntroduction() {
  return (
    <>
      <Translate
        pt={
          <>
            A cada rodada um jogador é escolhido para ser o <TextHighlight>juiz</TextHighlight> e colocar os
            cenários em ordem. Os outros jogadores devem tentar adivinhar qual a ordem o jogador principal
            colocou cada cenário.
          </>
        }
        en={
          <>
            Each round a player is chosen to be the <TextHighlight>judge</TextHighlight> and put the scenarios
            in order. The other players must try to guess which order the main player placed each scenario.
          </>
        }
      />
      <br />
    </>
  );
}
