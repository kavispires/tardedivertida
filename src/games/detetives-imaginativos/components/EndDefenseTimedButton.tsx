// Components
import { TimedButton } from 'components/buttons';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
// Internal
import type { SubmitDefensePayload } from '../utils/types';

type EndDefenseTimedButtonProps = {
  onFinishDefenseClick: (payload: SubmitDefensePayload) => void;
  isLoading?: boolean;
};

export function EndDefenseTimedButton({ onFinishDefenseClick, isLoading }: EndDefenseTimedButtonProps) {
  return (
    <SpaceContainer align="center">
      <TimedButton
        duration={40}
        type="primary"
        onClick={(timeLeft) => onFinishDefenseClick({ defenseTime: timeLeft })}
        onExpire={() => onFinishDefenseClick({ defenseTime: 0 })}
        disabled={isLoading}
        size="large"
        loading={isLoading}
      >
        <Translate pt="Concluir Defesa" en="End Defense" />
      </TimedButton>
    </SpaceContainer>
  );
}
