// Ant Design Resources
import { Typography } from 'antd';
// Components
import { Translate } from '@components/language/Translate';

export function GeneralRules() {
  return (
    <Typography.Paragraph component="ul">
      <li>
        <Translate
          en="The group has 90 seconds to decide who dies."
          pt="O grupo tem 90 segundos para decidir quem deve morrer."
        />
      </li>
      <li>
        <Translate
          en="Each player votes secretly by selecting one of the targets in the bottom of the page."
          pt="Cada um vota secretamente, escolha seu alvo clicando em um dos avatares abaixo."
        />
      </li>
      <li>
        <Translate
          en="You can swap your vote up to 3 times within the timer."
          pt="Você pode trocar seu alvo até 3 vezes durante o tempo."
        />
      </li>
      <li>
        <Translate
          en="You may communicate openly or use one of the means of communication:"
          pt="Você pode se comunicar verbalmente ou usando 1 dos meios de comunicação:"
        />
      </li>
      <li>
        <Translate
          en="- Send a public anonymous message to all"
          pt="- Mandar uma mensagem anônima para todos"
        />
      </li>
      <li>
        <Translate
          en="- Send a private anonymous message to someone"
          pt="- Mandar uma mensagem secreta para alguém"
        />
      </li>
      <li>
        <Translate
          en="Your objective is to survive:"
          pt="O objetivo é sobreviver:"
        />
      </li>
      <li>
        <Translate
          en="- If you don't vote for the most voted player, you die"
          pt="- Se você não votar no mais votado, você morre"
        />
      </li>
      <li>
        <Translate
          en='- If you think you are the most voted player, you may use "Ambush" , but...'
          pt='- Se você acha que será o mais votado, você pode usar "Emboscada", mas...'
        />
      </li>
      <li>
        <Translate
          en='- If you use "Ambush" and you&#39;re not the most voted, you die'
          pt='- Se você usar "Emboscada" e não for o mais votado, você morre'
        />
      </li>
      <li>
        <Translate
          en='- If you are the most voted and did not used "Ambush", you die'
          pt='- Se você for o mais votado e não votou usou "Emboscada", você morre'
        />
      </li>
      <li>
        <Translate
          en='- If you voted for the most voted player but they played "Ambush", you die'
          pt='- Se você votou no mais votado, mas o mais votado usou "Emboscada", você morre'
        />
      </li>
      <li>
        <Translate
          en="Good luck!"
          pt="Boa sorte!"
        />
      </li>
    </Typography.Paragraph>
  );
}
