import { Button, Space, Steps } from 'antd';
import { DualTranslate, Translate } from 'components/language';
import { useState } from 'react';
import { SelectableObjectsGrid } from './SelectableObjectsGrid';
import { Instruction, Title } from 'components/text';
import { useBooleanDictionary } from 'hooks/useBooleanDictionary';
import { Card } from 'components/cards';
import { useLanguage } from 'hooks/useLanguage';
import { useLoading } from 'hooks/useLoading';
import clsx from 'clsx';
import { getAnimationClass } from 'utils/helpers';

type HumanSeedingStepsProps = {
  user: GamePlayer;
  items: Item[];
  onSubmitSeeds: GenericFunction;
};

export function HumanSeedingSteps({ user, items, onSubmitSeeds }: HumanSeedingStepsProps) {
  const { translate } = useLanguage();
  const { isLoading } = useLoading();
  const [seeds, setSeeds] = useState<Record<string, string[]>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const {
    dict: selected,
    updateDict: updateSelected,
    setDict,
    reset,
    keys: selectedObjectsIds,
  } = useBooleanDictionary({});

  const attributes = (user.seeds ?? []) as Sign[];
  const steps = attributes.map((attribute) => ({
    title: <DualTranslate>{attribute.attribute}</DualTranslate>,
    description: seeds[attribute.key]?.length ?? 0,
  }));

  const onAddSeeds = () => {
    setSeeds((previousSeeds) => ({
      ...previousSeeds,
      [attributes[currentStep].key]: selectedObjectsIds,
    }));
    reset();
    setCurrentStep((previousStep) => previousStep + 1);
  };

  const previousAttribute = () => {
    setCurrentStep((previousStep) => previousStep - 1);
    const newCurrentDict = (seeds[attributes[currentStep - 1].key] ?? []).reduce(
      (acc: BooleanDictionary, entry) => {
        acc[entry] = true;
        return acc;
      },
      {}
    );
    setDict(newCurrentDict);
  };

  const onDoneSeeding = () => {
    setSeeds((previousSeeds) => ({
      ...previousSeeds,
      [attributes[currentStep].key]: selectedObjectsIds,
    }));
    onSubmitSeeds({ seeds });
  };

  return (
    <Space className="space-container contained seeding-container" direction="vertical" wrap>
      <Steps progressDot current={currentStep} items={steps} />

      <Space className="boards-container" wrap>
        <SelectableObjectsGrid
          items={items}
          selectedObjects={selected}
          selectObject={updateSelected}
          user={user}
          maxObjects={25}
          hideKey
        />
        <Space direction="vertical" key={currentStep} className="seeding-attribute-container">
          <Title level={3} size="xx-small">
            <Translate pt="Análise" en="Analysis" />
          </Title>
          {Boolean(attributes?.[currentStep]) && (
            <div className="attribute-card-container">
              <Instruction>
                <Translate
                  pt="Selecione todos os itens que possuem a característica:"
                  en="Select all the items that have the attribute"
                />
              </Instruction>
              <Card
                className={clsx('attribute-card', getAnimationClass('tada'))}
                header={translate('Atributo', 'Attribute')}
                randomColor
                key={attributes[currentStep].key}
              >
                <DualTranslate>{attributes[currentStep].attribute}</DualTranslate>
              </Card>

              <Instruction>
                <Translate
                  pt="Se nenhum item combina com a característica, apenas vá para o próximo."
                  en="If no item matches the attribute, just go to the next one."
                />
              </Instruction>

              <Space className="seeds-button-container">
                {currentStep > 0 && (
                  <Button size="large" onClick={previousAttribute} disabled={isLoading}>
                    <Translate pt="Atributo anterior" en="Previous attribute" />
                  </Button>
                )}
                {currentStep < attributes.length - 1 ? (
                  <Button size="large" type="primary" onClick={onAddSeeds} disabled={user.ready}>
                    <Translate pt="Próximo atributo" en="Next attribute" />
                  </Button>
                ) : (
                  <Button size="large" type="primary" onClick={onDoneSeeding} disabled={isLoading}>
                    <Translate pt="Enviar análises" en="Submit Analyses" />
                  </Button>
                )}
              </Space>
            </div>
          )}
        </Space>
      </Space>
    </Space>
  );
}
