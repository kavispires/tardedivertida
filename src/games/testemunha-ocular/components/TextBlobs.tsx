// Components
import { Translate } from 'components/language';
import { Instruction } from 'components/text';

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
