// Ant Design Resources
import { BarChartOutlined } from '@ant-design/icons';
import { Button } from 'antd';
// Components
import { Translate } from 'components/language/Translate';
// Internal
import { Region } from './Region';

type ShowResultsButtonProps = {
  isComplete: boolean;
  setShowResultModal: (show: boolean) => void;
};

export function ShowResultsButton({ isComplete, setShowResultModal }: ShowResultsButtonProps) {
  if (!isComplete) {
    return null;
  }

  return (
    <Region
      className="results-container"
      align="center"
    >
      <Button
        onClick={() => setShowResultModal(true)}
        type="primary"
        icon={<BarChartOutlined />}
      >
        <Translate
          pt="Ver Resultado"
          en="Show Results"
        />
      </Button>
    </Region>
  );
}
