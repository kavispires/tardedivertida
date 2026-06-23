// Types
import type { GamePlayers, GamePlayer } from 'types/game';
// Hooks
import { useLoading } from '@hooks/useLoading';
// Components
import { Translate } from '@components/language/Translate';
import { Step, type StepProps } from '@components/steps/Step';
import { Instruction } from '@components/text/Instruction';
import { StepTitle } from '@components/text/StepTitle';

type StepTemplateProps = {
  players: GamePlayers;
  user: GamePlayer;
} & Pick<StepProps, 'announcement'>;

export function StepTemplate({ announcement }: StepTemplateProps) {
  const { isLoading } = useLoading();

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle>
        <Translate
          pt={<>?</>}
          en={<>?</>}
        />
      </StepTitle>

      {isLoading}
      <Instruction contained>
        <Translate
          pt={<>?</>}
          en={<>?</>}
        />
      </Instruction>
    </Step>
  );
}
