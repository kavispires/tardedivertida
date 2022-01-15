import { Instruction, Translate } from '../../components';

export function WitnessRules() {
  return (
    <Instruction contained>
      <Translate
        pt="Em Testemunha Ocular, um jogador será a testemunha que presenciou um crime desconhecido. Essa testemunha responderá perguntas de sim-ou-não para ajudar os outros jogadores, detetives, a liberarem pelo menos um dos 12 suspeitos em cada rodada. Você quer ser a testemunha?"
        en="In Eye Witness, a player will be the witness who witnessed an unknown crime. This witness will answer yes-or-no questions to help the other players, detective, to release at least one of the 12 suspects each round. Do you want to be the witness?"
      />
    </Instruction>
  );
}

type AnnouncementContentProps = {
  didUserWin: boolean;
};

export function AnnouncementContent({ didUserWin }: AnnouncementContentProps) {
  return didUserWin ? (
    <Instruction>
      <Translate
        pt="O criminoso foi capturado e preso e vai morrer na cadeira elétrica! Obrigado pelo seu serviço e dedicação nesse caso!"
        en="The perpetrator was captured, arrested, and will be executed by the electric chair! Thank you for your service!"
      />
    </Instruction>
  ) : (
    <Instruction>
      <Translate
        pt="O criminoso não foi capturado. Tudo por conta da sua investigação porca. Ele(a) saiu pelo mundo a fora cometendo mais crimes. Saiu até nos jornais!"
        en="The perpetrator got away. Thanks to you and your lousy investigation. Now they are out and about committing more crimes. It was even on the news!"
      />
    </Instruction>
  );
}
