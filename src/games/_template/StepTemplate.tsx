// Hooks
import { useLoading } from 'hooks/useLoading';
// Components
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Translate } from 'components/language';

type StepPlayCardProps = {
  players: GamePlayers;
  user: GamePlayer;
} & AnnouncementProps;

export function StepPlayCard({ players, user, announcement }: StepPlayCardProps) {
  const { isLoading } = useLoading();

  return (
    <Step fullWidth announcement={announcement}>
      <Title>Title of Step</Title>

      <Instruction contained>
        <Translate pt={<>?</>} en={<>?</>} />
      </Instruction>
    </Step>
  );
}
