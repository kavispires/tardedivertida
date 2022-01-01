import { Button } from 'antd';
import { ButtonContainer, Step } from '../../components';

export function StepSceneSelection({ increaseStep }: any) {
  return (
    <Step>
      <div className="aa">Scene</div>
      <ButtonContainer>
        <Button type="primary" onClick={increaseStep}>
          »»»
        </Button>
      </ButtonContainer>
    </Step>
  );
}
