// Types
import type { GamePlayers, GamePlayer } from 'types/player';
// Hooks
import { useLoading } from 'hooks/useLoading';
// Components
import { Translate } from 'components/language';
import { Step, type StepProps } from 'components/steps';
import { Instruction, Title } from 'components/text';

type StepTemplateProps = {
  players: GamePlayers;
  user: GamePlayer;
} & Pick<StepProps, 'announcement'>;

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
