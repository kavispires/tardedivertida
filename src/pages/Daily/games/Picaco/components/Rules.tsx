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
              en="Every 10 seconds, you will read an expression and draw."
              pt="A cada 10 segundos, você irá ler uma expressão e desenhar."
            />
          </li>
          <li>
            <Translate
              en="After 6 expressions or 1 minute, your drawings will be saved in the database"
              pt="Após 6 expressões, ou 1 minuto, seus desenhos serão salvos no banco de dados."
            />
          </li>
          <li>
            <Translate
              en="Try to do your best possible, avoid NSFW content, and focus on the details."
              pt="Tente fazer o melhor possível, evite pornografia, e foque nos detalhes."
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
