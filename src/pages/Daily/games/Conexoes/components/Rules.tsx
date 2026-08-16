// Components
import { Translate } from '@components/language/Translate';
// Pages
import { RulesWrapper } from '@pages/Daily/components/RulesWrapper';

type RulesProps = {
  date: string;
};

export function Rules({ date }: RulesProps) {
  return (
    <RulesWrapper
      date={date}
      basicRules={
        <>
          <li>
            <Translate
              en="Contribute to TD's database!"
              pt="Contribua com o banco de dados do TD!"
            />
          </li>
          <li>
            <Translate
              en="You will receive pairs of images to evaluate."
              pt="Você receberá pares de imagens para avaliar."
            />
          </li>
          <li>
            <Translate
              en="For each pair, decide if the two images are related or not."
              pt="Para cada par, decida se as duas imagens estão de alguma forma relacionadas ou não."
            />
          </li>
          <li>
            <Translate
              en='Swipe right or click "Yes" if the images are related.'
              pt='Deslize para a direita ou clique em "Sim" se as imagens estiverem relacionadas.'
            />
          </li>
          <li>
            <Translate
              en='Swipe left or click "No" if they are not related.'
              pt='Deslize para a esquerda ou clique em "Não" se não estiverem relacionadas.'
            />
          </li>
          <li>
            <Translate
              en="You must evaluate at least 10 pairs before saving."
              pt="Você deve avaliar no mínimo 10 pares antes de salvar."
            />
          </li>
          <li>
            <Translate
              en="You can continue evaluating as many pairs as you want!"
              pt="Você pode continuar avaliando quantos pares quiser!"
            />
          </li>
          <li>
            <Translate
              en="Good luck!"
              pt="Boa sorte!"
            />
          </li>
        </>
      }
    />
  );
}
