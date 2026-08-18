// Components
import { Translate } from '@components/language/Translate';
import { TextHighlight } from '@components/text/TextHighlight';

export function FirstRoundIntroduction() {
  return (
    <>
      <Translate
        pt="A cada rodada um jogador é escolhido para ser o {judge} e colocar os cenários em ordem. Os outros jogadores devem tentar adivinhar qual a ordem o jogador principal colocou cada cenário."
        en="Each round a player is chosen to be the {judge} and put the scenarios in order. The other players must try to guess which order the main player placed each scenario."
        values={{ judge: <TextHighlight>juiz</TextHighlight> }}
      />
      <br />
    </>
  );
}
