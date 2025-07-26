// Types
import type { GamePlayers, GamePlayer } from 'types/player';
// Hooks
import { useLoading } from 'hooks/useLoading';
// Components
import { Translate } from 'components/language';
import { Step, type StepProps } from 'components/steps';
import { Instruction, StepTitle } from 'components/text';

type StepTemplateProps = {
  players: GamePlayers;
  user: GamePlayer;
} & Pick<StepProps, 'announcement'>;

export function StepTemplate({ announcement }: StepTemplateProps) {
  const { isLoading } = useLoading();

  return (
    <Step fullWidth announcement={announcement}>
      <StepTitle>
        <Translate pt={<>?</>} en={<>?</>} />
      </StepTitle>

      {isLoading}
      <Instruction contained>
        <Translate pt={<>?</>} en={<>?</>} />
      </Instruction>
    </Step>
  );
}
