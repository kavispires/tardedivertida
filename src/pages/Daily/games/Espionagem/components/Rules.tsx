import { RulesWrapper } from 'pages/Daily/components/RulesWrapper';
// Ant Design Resources
import { HeartFilled } from '@ant-design/icons';
// Components
import { Translate } from 'components/language';

type RulesProps = {
  date: string;
};

export function Rules({ date }: RulesProps) {
  return (
    <RulesWrapper
      demoVersion
      date={date}
      basicRules={
        <Translate
          en={
            <>
              <li>You are a spy in a event and needs to find out who the culprit is.</li>
              <li>
                Your intel has statements to help identify the culprit, and you see a new statement every time
                you release two suspects.
              </li>
              <li>
                You must release all innocent people so <strong>the culprit is the last person left</strong>.
              </li>
              <li>
                You can use a <HeartFilled /> to see special statements that help with more suspects.
              </li>
              <li>
                <strong>WARNING: You lose immediately if you release the culprit. Good luck!</strong>
              </li>
            </>
          }
          pt={
            <>
              <li>Você é um espião em um evento e precisa descobrir quem é o culpado.</li>
              <li>
                Você começa com uma declaração de seus informantes para ajudar a identificar o culpado e a
                cada dois suspeitos que você libera uma nova declaração será revelada.
              </li>
              <li>
                Você deve liberar todas as pessoas inocentes para que{' '}
                <strong>o culpado seja a última pessoa restante</strong>.
              </li>
              <li>
                Você pode usar um <HeartFilled /> para ver declarações especiais que ajudam com mais
                suspeitos.
              </li>
              <li>
                <strong>ATENÇÃO: Você perde imediatamente se liberar o culpado. Boa sorte!</strong>
              </li>
            </>
          }
        />
      }
    />
  );
}
