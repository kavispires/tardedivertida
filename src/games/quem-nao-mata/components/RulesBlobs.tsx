import { Translate } from 'components/language';

export function GeneralRules() {
  return (
    <Translate
      pt={
        <ul>
          <li>O grupo tem 90 segundos para decidir quem deve morrer.</li>
          <li>Cada um vota secretamente, escolha seu alvo clicando em um dos avatares abaixo.</li>
          <li>Você pode trocar seu alvo até 3 vezes durante o tempo.</li>
          <li>Você pode se comunicar verbalmente ou usando 1 dos meios de comunicação:</li>
          <li>- Mandar uma mensagem anônima para todos</li>
          <li>- Mandar uma mensagem secreta para alguém</li>
          <li>O objetivo é sobreviver:</li>
          <li>- Se você não votar no mais votado, você morre</li>
          <li>- Se você acha que será o mais votado, você pode usar "Emboscada", mas...</li>
          <li>- Se você usar "Emboscada" e não for o mais votado, você morre</li>
          <li>- Se você for o mais votado e não votou usou "Emboscada", você morre</li>
          <li>- Se você votou no mais votado, mas o mais votado usou "Emboscada", você morre</li>
          <li>Boa sorte!</li>
        </ul>
      }
      en={
        <ul>
          <li>The group has 90 seconds to decide who dies.</li>
          <li>Each player votes secretly by selecting one of the targets in the bottom of the page.</li>
          <li>You can swap your vote up to 3 times within the timer.</li>
          <li>You may communicate openly or use one of the means of communication:</li>
          <li>- Send a public anonymous message to all</li>
          <li>- Send a private anonymous message to someone</li>
          <li>Your objective is to survive:</li>
          <li>- If you don't vote for the most voted player, you die</li>
          <li>- If you think you are the most voted player, you may use "Ambush" , but...</li>
          <li>- If you use "Ambush" and you're not the most voted, you die</li>
          <li>- If you are the most voted and did not used "Ambush", you die</li>
          <li>- If you voted for the most voted player but they played "Ambush", you die</li>
          <li>Good luck!</li>
        </ul>
      }
    />
  );
}
