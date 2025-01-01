// Components
import { TimedButton } from 'components/buttons';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';

type EndDefenseTimedButtonProps = {
  onFinishDefenseClick: GenericFunction;
  isLoading?: boolean;
};

export function EndDefenseTimedButton({ onFinishDefenseClick, isLoading }: EndDefenseTimedButtonProps) {
  return (
    <SpaceContainer align="center">
      <TimedButton
        duration={40}
        type="primary"
        onClick={onFinishDefenseClick}
        onExpire={onFinishDefenseClick}
        disabled={isLoading}
        size="large"
        loading={isLoading}
      >
        <Translate pt="Concluir Defesa" en="End Defense" />
      </TimedButton>
    </SpaceContainer>
  );
}
