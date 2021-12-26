// Design Resources
import { Button } from 'antd';
import { FireFilled } from '@ant-design/icons';

type ForceNextPhaseButtonProps = {
  isLoading?: boolean;
  onGoToNextPhase: GenericFunction;
};
export const ForceNextPhaseButton = ({ isLoading = false, onGoToNextPhase }: ForceNextPhaseButtonProps) => (
  <Button
    icon={<FireFilled />}
    type="primary"
    danger
    onClick={() => onGoToNextPhase({})}
    disabled={isLoading}
    size="large"
    className="full-width"
  >
    Force Next Phase
  </Button>
);
