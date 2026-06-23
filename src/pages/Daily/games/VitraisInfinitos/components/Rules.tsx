// Components
import { Translate } from '@components/language/Translate';
// Pages
import { RulesWrapper } from '@pages/Daily/components/RulesWrapper';

export function Rules() {
  return (
    <RulesWrapper
      date="0000-00-00" // Not used in this game
      basicRules={
        <Translate
          pt={
            <>
              <li>
                Monte o quebra-cabeça arrastando as peças para o lugar correto. As peças conectadas se movem
                juntas!
              </li>
              <li>Cada vez que você abre o jogo, uma nova imagem é gerada para você montar.</li>
              <li>Quer de novo? Clique no botão "Outra imagem" para receber um novo vitral!</li>
              <li>
                Mas cada vez que você gera uma nova imagem, o número de peças aumenta, chegando até 36 peças
                para os mais corajosos! Boa sorte!
              </li>
            </>
          }
          en={
            <>
              <li>
                Solve the puzzle by dragging the pieces to the correct place. Connected pieces move together!
              </li>
              <li>Each time you open the game, a new image is generated for you to solve.</li>
              <li>Want another? Click the "Another image" button to get a new stained glass!</li>
              <li>
                But be warned, each time you generate a new image, the number of pieces increases, going up to
                36 pieces for the bravest! Good luck!
              </li>
            </>
          }
        />
      }
    />
  );
}
