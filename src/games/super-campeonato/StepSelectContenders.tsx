// Ant Design Resources
import { Space } from 'antd';

// Components
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { Card } from 'components/cards';
import { ContendersHand } from './components/ContendersHand';
import { useMock } from 'hooks';
import { mockSelectContender } from './utils/mock';

type StepSelectContendersProps = {
  onSubmitContender: GenericFunction;
  challenge: DefaultTextCard;
  userContenders: WContender[];
};

export function StepSelectContenders({
  onSubmitContender,
  challenge,
  userContenders,
}: StepSelectContendersProps) {
  useMock(() => {
    onSubmitContender({ contendersIds: mockSelectContender(userContenders) });
  });

  return (
    <Step fullWidth>
      <Title size="medium">
        <Translate pt="Quem pode ganhar esse desafio?" en="Who can win this challenge?" />
      </Title>

      <Space className="space-container" align="center">
        <Card header={challenge.text[0]} randomColor>
          {challenge.text}
        </Card>
      </Space>

      <Instruction contained>
        <Translate
          pt="Selecione um de seus competidores para entrar no campeonato"
          en="Select one of your contenders to join the championship"
        />
      </Instruction>

      <ContendersHand
        contenders={userContenders}
        onSelect={(id) => onSubmitContender({ contendersIds: [id] })}
      />
    </Step>
  );
}
