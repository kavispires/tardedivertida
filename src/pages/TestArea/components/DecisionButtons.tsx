// Ant Design Resources
import { Button } from 'antd';
// Components
import { DualTranslate, Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { Instruction } from 'components/text';

type DecisionButtonsProps = {
  step: number;
  onClick: (step: number, value: boolean) => void;
  prompt: DualLanguageValue;
};

export function DecisionButtons({ step, onClick, prompt }: DecisionButtonsProps) {
  return (
    <div className="container">
      <Instruction>
        <DualTranslate>{prompt}</DualTranslate>
      </Instruction>
      <SpaceContainer wrap>
        <Button
          type="primary"
          size="large"
          onClick={() => onClick(step, true)}
        >
          <Translate
            pt="Sim"
            en="Yes"
          />
        </Button>
        <Button
          type="primary"
          danger
          size="large"
          onClick={() => onClick(step, false)}
        >
          <Translate
            pt="Não"
            en="No"
          />
        </Button>
      </SpaceContainer>
    </div>
  );
}
