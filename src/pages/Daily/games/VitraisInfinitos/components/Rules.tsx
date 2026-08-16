// Components
import { Translate } from '@components/language/Translate';
// Pages
import { RulesWrapper } from '@pages/Daily/components/RulesWrapper';

export function Rules() {
  return (
    <RulesWrapper
      date="0000-00-00" // Not used in this game
      basicRules={
        <>
          <li>
            <Translate
              pt="Monte o quebra-cabeça arrastando as peças para o lugar correto. As peças conectadas se movem juntas!"
              en="Solve the puzzle by dragging the pieces to the correct place. Connected pieces move together!"
            />
          </li>
          <li>
            <Translate
              pt="Cada vez que você abre o jogo, uma nova imagem é gerada para você montar."
              en="Each time you open the game, a new image is generated for you to solve."
            />
          </li>
          <li>
            <Translate
              pt='Quer de novo? Clique no botão "Outra imagem" para receber um novo vitral!'
              en='Want another? Click the "Another image" button to get a new stained glass!'
            />
          </li>
          <li>
            <Translate
              pt="Mas cada vez que você gera uma nova imagem, o número de peças aumenta, chegando até 36 peças para os mais corajosos! Boa sorte!"
              en="But be warned, each time you generate a new image, the number of pieces increases, going up to 36 pieces for the bravest! Good luck!"
            />
          </li>
        </>
      }
    />
  );
}
