import { RulesWrapper } from 'pages/Daily/components/RulesWrapper';
// Components
import { Translate } from 'components/language';

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
              <li>Você receberá rodadas de perguntas com seis personagens.</li>
              <li>
                Para cara pergunta, selecione todos os personagens que você acha que se encaixam à pergunta.
              </li>
              <li>Boa sorte!</li>
            </>
          }
          en={
            <>
              <li>Contribute to TD's database!</li>
              <li>You'll receive a round of questions and six characters.</li>
              <li>For each question, select all characters you think fit the question.</li>
              <li>Good luck!</li>
            </>
          }
        />
      }
    />
  );
}
