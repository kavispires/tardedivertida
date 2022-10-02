import { Translate } from 'components/language';
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';

type StepSelectPagesProps = {
  doors: CardId[];
  pages: CardId[];
  currentDoor: number;
  answerDoorId: CardId;
  trap: string;
};

export function StepSelectPages({ doors, pages, currentDoor, answerDoorId, trap }: StepSelectPagesProps) {
  return (
    <Step fullWidth>
      <Title size="medium">
        <Translate pt="Ajude os jogadores!" en="Ajude os jogadores!" />
      </Title>

      <Instruction contained>TODO TEXT {trap}</Instruction>
    </Step>
  );
}
