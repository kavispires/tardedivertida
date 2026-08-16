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
              en="You'll receive a round of questions and six characters."
              pt="Você receberá rodadas de perguntas com seis personagens."
            />
          </li>
          <li>
            <Translate
              en="For each question, select all characters you think fit the question."
              pt="Para cara pergunta, selecione todos os personagens que você acha que se encaixam à pergunta."
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
