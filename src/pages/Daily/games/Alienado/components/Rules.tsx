// Ant Design Resources
import { HeartFilled } from '@ant-design/icons';
// Components
import { Translate } from '@components/language/Translate';
// Pages
import { RulesWrapper } from '@pages/Daily/components/RulesWrapper';
// Internal
import { SETTINGS } from '../utils/settings';

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
              en="The alien needs to abduct some things, but it can't speak our language."
              pt="O alienígena precisa de sua ajuda para abduzir 4 coisas, porém ele não fala a língua dos terráqueos."
            />
          </li>
          <li>
            <Translate
              en="The alien communicates through symbols that represent a common attribute between the given examples."
              pt="O alienígena se comunica através de símbolos que representam um atributo em comum entre os exemplos dados."
            />
          </li>
          <li>
            <Translate
              en="For example, what does a ball, a watermelon, and a pizza have in common? They're all round! Does the alien mean that symbol represents round?"
              pt="Por exemplo, o que uma bola, uma melancia e uma pizza tem em comum? Todos são redondos! Será que o alienígena quer dizer que aquele símbolo significa redondo?"
            />
          </li>
          <li>
            <Translate
              en="You must deliver 4 things in the correct order and press send. The alien only tells you if all are correct or not."
              pt="Você deve entregar as 4 coisas na ordem correta de uma vez. O alienígena apenas te diz se todas estão corretas ou não."
            />
          </li>
          <li>
            <Translate
              en="Each wrong attempt removes a heart and you only have {hearts} <heart/>."
              pt="Cada tentativa errada remove um coração e você tem apenas {hearts} <heart/>."
              values={{
                hearts: SETTINGS.HEARTS,
                heart: <HeartFilled />,
              }}
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
      additionalRules={
        <>
          <Translate
            en="<strong>Tips:</strong>"
            pt="<strong>Dicas:</strong>"
          />
          <li>
            <Translate
              en='To better understand the symbols, click the "Understand how the alien thinks" button'
              pt='Para entender melhor os símbolos, clique no botão "Entenda como o alienígena pensa"'
            />
          </li>
        </>
      }
    />
  );
}
