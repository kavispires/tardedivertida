// Hooks
import { useLoading } from 'hooks/useLoading';
// Components
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Translate } from 'components/language';

type StepTemplateProps = {
  players: GamePlayers;
  user: GamePlayer;
} & AnnouncementProps;

export function StepTemplate({ players, user, announcement }: StepTemplateProps) {
  const { isLoading } = useLoading();

  return (
    <Step fullWidth announcement={announcement}>
      <Title>
        <Translate pt={<>?</>} en={<>?</>} />
      </Title>

      {isLoading}
      <Instruction contained>
        <Translate pt={<>?</>} en={<>?</>} />
      </Instruction>
    </Step>
  );
}
