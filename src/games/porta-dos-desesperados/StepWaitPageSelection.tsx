import { Translate } from 'components/language';
import { WaitingRoom } from 'components/players';
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';

type StepSelectPagesProps = {
  doors: CardId[];
  pages: CardId[];
  currentDoor: number;
  answerDoorId: CardId;
  trap: string;
  players: GamePlayers;
};

export function StepSelectPages({ currentDoor, trap, players }: StepSelectPagesProps) {
  return (
    <Step fullWidth>
      <Title size="medium">
        <Translate
          pt={<>Aguarde enquanto a possessão acontece</>}
          en={<>Please wait while the possession has finished</>}
        />
      </Title>

      <WaitingRoom players={players} />

      <Instruction contained>TODO TEXT {trap}</Instruction>
    </Step>
  );
}
