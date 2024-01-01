import clsx from 'clsx';
import { useState } from 'react';
// Ant Design Resources
import { Button, Flex, Space, Steps, Switch } from 'antd';
// Types
import type { Seed } from '../utils/types';
// Hooks
import { useBooleanDictionary } from 'hooks/useBooleanDictionary';
import { useLoading } from 'hooks/useLoading';
// Utils
import { getAnimationClass } from 'utils/helpers';
import { SEPARATOR } from 'utils/constants';
// Components
import { DualTranslate, Translate } from 'components/language';
import { Instruction, Title } from 'components/text';
import { Card } from 'components/cards';
import { ItemCard } from 'components/cards/ItemCard';

type HumanSeedingStepsProps = {
  user: GamePlayer;
  onSubmitSeeds: GenericFunction;
};

export function HumanSeedingSteps({ user, onSubmitSeeds }: HumanSeedingStepsProps) {
  const { isLoading } = useLoading();
  const [currentStep, setCurrentStep] = useState(0);
  const [seeds, setSeeds] = useState<NumberDictionary>({});
  const { dict: selected, updateDict: updateSelected, setDict, reset } = useBooleanDictionary({});

  const seeders = Object.values<Seed>(user.seeds);
  const steps = seeders.map((seed) => ({
    title: <DualTranslate>{seed.attribute.attribute}</DualTranslate>,
    description: seed.items.length ?? 0,
  }));

  const seed = seeders[currentStep];

  const onAddSeeds = () => {
    const values = seed.items.reduce((acc: NumberDictionary, item) => {
      const key = `${item.id}${SEPARATOR}${seed.attribute.key}`;
      acc[key] = selected[key] ? 3 : -3;
      return acc;
    }, {});

    setSeeds((previousSeeds) => ({
      ...previousSeeds,
      ...values,
    }));
    reset();
    setCurrentStep((previousStep) => previousStep + 1);
  };

  const onGoToPreviousAttribute = () => {
    const newStep = currentStep - 1;
    setCurrentStep((previousStep) => previousStep - 1);

    const previousSeed = seeders[newStep];

    const values = seeders[newStep].items.reduce((acc: BooleanDictionary, item) => {
      const key = `${item.id}${SEPARATOR}${previousSeed.attribute.key}`;
      if (seeds[key] === 3) {
        acc[key] = true;
      }
      return acc;
    }, {});

    setDict(values);
  };

  const onDoneSeeding = () => {
    const values = seed.items.reduce((acc: NumberDictionary, item) => {
      const key = `${item.id}${SEPARATOR}${seed.attribute.key}`;
      acc[key] = selected[key] ? 3 : -3;
      return acc;
    }, {});

    setSeeds((previousSeeds) => ({
      ...previousSeeds,
      ...values,
    }));

    onSubmitSeeds({ seeds });
  };

  return (
    <Space className="space-container contained seeding-container" direction="vertical" wrap>
      <div className="seeding-container__stepper">
        <Steps progressDot current={currentStep} items={steps} />
      </div>

      <Space wrap direction="vertical">
        <Title level={3} size="xx-small">
          <Translate pt="Análise" en="Analysis" />
        </Title>
        <Instruction>
          <Translate
            pt="Ative o botão de todos os itens que possuem a característica:"
            en="Activate the switch of all items that have the attribute"
          />
        </Instruction>

        <Space className="space-container">
          <Card
            className={clsx('attribute-card', getAnimationClass('tada'))}
            key={seed.attribute.key}
            hideHeader
          >
            <DualTranslate>{seed.attribute.attribute}</DualTranslate>
          </Card>
        </Space>

        <Flex justify="center" gap="middle" wrap="wrap">
          {seed.items.map((item) => {
            const key = `${item.id}${SEPARATOR}${seed.attribute.key}`;
            return (
              <Flex vertical justify="center" align="center" gap="small" key={key}>
                <ItemCard id={`${item.id}`} />
                <Switch
                  checkedChildren={<Translate pt="Sim" en="Yes" />}
                  unCheckedChildren={<Translate pt="Não" en="No" />}
                  onChange={() => updateSelected(key)}
                  checked={selected[key]}
                />
              </Flex>
            );
          })}
        </Flex>

        <Instruction>
          <Translate
            pt="Se nenhum item combina com a característica, apenas vá para o próximo."
            en="If no item matches the attribute, just go to the next one."
          />
        </Instruction>

        <Space className="space-container">
          {currentStep < seeders.length - 1 && (
            <Button size="large" onClick={onGoToPreviousAttribute} disabled={isLoading || currentStep === 0}>
              <Translate pt="Atributo anterior" en="Previous attribute" />
            </Button>
          )}
          {currentStep < seeders.length - 1 ? (
            <Button size="large" type="primary" onClick={onAddSeeds} disabled={user.ready}>
              <Translate pt="Próximo atributo" en="Next attribute" />
            </Button>
          ) : (
            <Button size="large" type="primary" onClick={onDoneSeeding} disabled={isLoading}>
              <Translate pt="Enviar análises" en="Submit Analyses" />
            </Button>
          )}
        </Space>
      </Space>
    </Space>
  );
}
