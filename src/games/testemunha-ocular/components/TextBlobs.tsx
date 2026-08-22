// Components
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';

type AnnouncementContentProps = {
  didUserWin: boolean;
};

export function AnnouncementContent({ didUserWin }: AnnouncementContentProps) {
  return didUserWin ? (
    <Surface>
      <Translate
        pt="O criminoso foi capturado e preso e vai morrer na cadeira elétrica!
        <br/>
        Obrigado pelo seu serviço e dedicação nesse caso!"
        en="The perpetrator was captured, arrested, and will be executed by the electric chair!
        <br/>
        Thank you for your service!"
      />
    </Surface>
  ) : (
    <Surface>
      <Translate
        pt="O criminoso escapou!
        <br/>
        Tudo por conta da sua investigação porca.
        <br/>
        Ele(a) saiu pelo mundo a fora cometendo mais crimes. Saiu até nos jornais!"
        en="The perpetrator got away.
        <br/>
        Thanks to you and your lousy investigation.
        <br/>
        Now they are out and about committing more crimes. It was even on the news!"
      />
    </Surface>
  );
}
