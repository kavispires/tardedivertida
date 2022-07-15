import { Space } from 'antd';
import { TimedButton } from 'components/buttons';
import { Translate } from 'components/language';

type EndDefenseTimedButtonProps = {
  onFinishDefenseClick: GenericFunction;
  isLoading?: boolean;
};

export function EndDefenseTimedButton({ onFinishDefenseClick, isLoading }: EndDefenseTimedButtonProps) {
  return (
    <Space className="space-container" align="center">
      <TimedButton
        duration={45}
        type="primary"
        onClick={onFinishDefenseClick}
        onExpire={onFinishDefenseClick}
        disabled={isLoading}
        size="large"
        showTimer
      >
        <Translate pt="Concluir Defesa" en="End Defense" />
      </TimedButton>
    </Space>
  );
}
