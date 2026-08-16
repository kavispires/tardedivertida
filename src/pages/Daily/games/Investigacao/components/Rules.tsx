// Ant Design Resources
import { AppstoreOutlined, AudioFilled, HeartFilled, SkinFilled } from '@ant-design/icons';
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
              en="You are a detective investigating a crime and need to find out who the culprit is."
              pt="Você é um detetive investigando um crime e precisa descobrir quem é o culpado."
            />
          </li>
          <li>
            <Translate
              en="Your intel has statements to help identify the culprit, and you see a new statement every time you release two suspects."
              pt="Você começa com uma declaração de seus informantes para ajudar a identificar o culpado e a cada dois suspeitos que você libera uma nova declaração será revelada."
            />
          </li>
          <li>
            <Translate
              en="You must release all innocent people so <strong>the culprit is the last person left</strong>."
              pt="Você deve liberar todas as pessoas inocentes para que <strong>o culpado seja a última pessoa restante</strong>."
            />
          </li>
          <li>
            <Translate
              en="There are statements about the physical appearance of the suspect <skin/>, about their position in the grid <appstore/>, and some hearsay about who they are as a person <audio/>."
              pt="Existem declarações sobre a aparência física do suspeito <skin/>, sobre sua posição na grade <appstore/>, e algumas fofocas sobre quem eles são como pessoa <audio/> que podem não ser tão confiáveis."
              values={{
                skin: <SkinFilled />,
                appstore: <AppstoreOutlined />,
                audio: <AudioFilled />,
              }}
            />
          </li>
          <li>
            <Translate
              en="You can use a <heart/> to see special statements that help with more suspects."
              pt="Você pode usar um <heart/> para ver declarações especiais que ajudam com mais suspeitos."
              values={{
                heart: <HeartFilled />,
              }}
            />
          </li>
          <li>
            <Translate
              en="<strong>WARNING: You lose immediately if you release the culprit. Good luck!</strong>"
              pt="<strong>ATENÇÃO: Você perde imediatamente se liberar o culpado. Boa sorte!</strong>"
            />
          </li>
        </>
      }
    />
  );
}
