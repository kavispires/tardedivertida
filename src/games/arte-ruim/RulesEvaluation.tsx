import { Instruction, Translate } from '../../components';

const RulesEvaluation = () => (
  <Instruction>
    <Translate
      pt={
        <>
          Encontre os pares de desenho e carta clicando em uma carta ou desenho e em seguida clicando em seu
          par.
          <br />
          Uma bandeirinha aparecerá no topo de cada desenho com a cor e letra da carta que você selecionou.
          <br />
          Quando encontrar todos os pares, envie sua avaliação!
        </>
      }
      en={
        <>
          Find the pairs of artwork and card by clicking on a card or artwork then on its match.
          <br />
          A ribbon will show up on the artwork with the color and letter of the matching card.
          <br />
          When you're done, click the button to send your evaluation!
        </>
      }
    />
  </Instruction>
);

export default RulesEvaluation;
