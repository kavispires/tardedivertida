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
        <Translate
          pt={
            <>
              <li>Contribua com o banco de dados do TD!</li>
              <li>Você receberá pares de imagens para avaliar.</li>
              <li>Para cada par, decida se as duas imagens estão de alguma forma relacionadas ou não.</li>
              <li>Deslize para a direita ou clique em "Sim" se as imagens estiverem relacionadas.</li>
              <li>Deslize para a esquerda ou clique em "Não" se não estiverem relacionadas.</li>
              <li>Você deve avaliar no mínimo 10 pares antes de salvar.</li>
              <li>Você pode continuar avaliando quantos pares quiser!</li>
              <li>Boa sorte!</li>
            </>
          }
          en={
            <>
              <li>Contribute to TD's database!</li>
              <li>You will receive pairs of images to evaluate.</li>
              <li>For each pair, decide if the two images are related or not.</li>
              <li>Swipe right or click "Yes" if the images are related.</li>
              <li>Swipe left or click "No" if they are not related.</li>
              <li>You must evaluate at least 10 pairs before saving.</li>
              <li>You can continue evaluating as many pairs as you want!</li>
              <li>Good luck!</li>
            </>
          }
        />
      }
    />
  );
}
