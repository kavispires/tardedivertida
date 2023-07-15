// Components
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { Forest } from './components/Forest';

type StepBuildWaitProps = {
  user: GamePlayer;
  forest: Tree[];
} & AnnouncementProps;

export function StepBuildWait({ user, announcement, forest }: StepBuildWaitProps) {
  return (
    <Step fullWidth announcement={announcement}>
      <Title>
        <Translate
          pt="Todos os jogadores já descobriam seu mapa completamente"
          en="All players have discovered your map completely"
        />
      </Title>

      <Instruction contained>
        <Translate
          pt={<>Aguarde pacientemente, você ainda vai participar na hora de adivinhar.</>}
          en={<>Sit and wait patiently, you will still participate when it's time to guess.</>}
        />
      </Instruction>

      <Forest forest={forest} map={user.map} showPath />
    </Step>
  );
}
