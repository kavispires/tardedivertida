import clsx from 'clsx';
import { orderBy } from 'lodash';
import { useMemo, useState } from 'react';
// Ant Design Resources
import { Badge, Button, Flex, Steps, Switch, Typography, type StepsProps } from 'antd';
// Types
import type { GamePlayer } from 'types/game';
// Hooks
import { useBooleanDictionary } from 'hooks/useBooleanDictionary';
import { useLanguage } from 'hooks/useLanguage';
import { useLoading } from 'hooks/useLoading';
// Utils
import { SEPARATOR } from 'utils/constants';
import { getAnimationClass } from 'utils/helpers';
// Components
import { Card } from 'components/cards/Card';
import { ItemCard } from 'components/cards/ItemCard';
import { DevButton } from 'components/debug/DevButton';
import { DualTranslate } from 'components/language/DualTranslate';
import { Translate } from 'components/language/Translate';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { Instruction } from 'components/text/Instruction';
import { RuleInstruction } from 'components/text/RuleInstruction';
import { Title } from 'components/text/Title';
import { alienAttributesUtils } from 'components/toolKits/AlienAttributes';
// Internal
import type { Seed, SubmitSeedingPayload } from '../utils/types';
import { mockSeeds } from '../utils/mockSeeds';

type HumanSeedingStepsProps = {
  onSubmitSeeds: (payload: SubmitSeedingPayload) => void;
  user: GamePlayer<{ seeds?: Dictionary<Seed> }>;
};

export function HumanSeedingSteps({ user, onSubmitSeeds }: HumanSeedingStepsProps) {
  const { isLoading } = useLoading();
  const { language } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [seeds, setSeeds] = useState<Dictionary<number>>({});
  const { dict: selected, updateDict: updateSelected, setDict, reset } = useBooleanDictionary({});

  const { seeders, steps } = useMemo(() => {
    const seeders = orderBy(Object.values<Seed>(user?.seeds ?? {}), [`attribute.name.${language}`], ['asc']);
    const steps: StepsProps['items'] = seeders.map((seed) => ({
      title: (
        <Typography.Text>
          <DualTranslate>{seed.attribute.name}</DualTranslate>
        </Typography.Text>
      ),
      content: (
        <Badge
          count={seed.items.length ?? 0}
          color="lime"
        />
      ),
    }));
    return { seeders, steps };
  }, [user?.seeds, language]);

  const seed = seeders[currentStep];

  const onAddSeeds = () => {
    const values = seed.items.reduce((acc: Dictionary<number>, item) => {
      const key = `${item.id}${SEPARATOR}${seed.attribute.id}`;
      acc[key] = selected[key]
        ? alienAttributesUtils.ATTRIBUTE_VALUE_DICT.RELATED.value
        : alienAttributesUtils.ATTRIBUTE_VALUE_DICT.UNRELATED.value;
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

    const values = seeders[newStep].items.reduce((acc: Dictionary<boolean>, item) => {
      const key = `${item.id}${SEPARATOR}${previousSeed.attribute.id}`;
      if (seeds[key] === 3) {
        acc[key] = true;
      }
      return acc;
    }, {});

    setDict(values);
  };

  const onDoneSeeding = () => {
    const values = seed.items.reduce((acc: Dictionary<number>, item) => {
      const key = `${item.id}${SEPARATOR}${seed.attribute.id}`;
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
    <SpaceContainer
      className="contained seeding-container"
      orientation="vertical"
      wrap
    >
      <Flex className="seeding-container__stepper">
        <Steps
          style={{ width: '100%' }}
          type="dot"
          size="small"
          current={currentStep}
          items={steps}
          responsive={false}
        />
      </Flex>

      <SpaceContainer vertical>
        <Title
          level={3}
          size="xx-small"
          colorScheme="light"
          marginBottom={0}
        >
          <Translate
            pt="Análise"
            en="Analysis"
          />
        </Title>
        <RuleInstruction type="action">
          <Translate
            pt="Ative o botão de todos os itens que possuem a característica:"
            en="Activate the switch of all items that have the attribute"
          />
        </RuleInstruction>

        <SpaceContainer vertical>
          <Card
            className={clsx('attribute-card', getAnimationClass('tada'))}
            key={seed.attribute.id}
            hideHeader
          >
            <Flex vertical>
              <DualTranslate>{seed.attribute.name}</DualTranslate>
              <small>
                <em>
                  <DualTranslate>{seed.attribute.description}</DualTranslate>
                </em>
              </small>
            </Flex>
          </Card>
        </SpaceContainer>

        <Flex
          justify="center"
          gap="middle"
          wrap="wrap"
        >
          {seed.items.map((item) => {
            const key = `${item.id}${SEPARATOR}${seed.attribute.id}`;
            return (
              <Flex
                vertical
                justify="center"
                align="center"
                gap="small"
                key={key}
              >
                <ItemCard
                  itemId={`${item.id}`}
                  text={item.name}
                  width={84}
                />
                <Switch
                  checkedChildren={
                    <Translate
                      pt="Sim"
                      en="Yes"
                    />
                  }
                  unCheckedChildren={
                    <Translate
                      pt="Não"
                      en="No"
                    />
                  }
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

        <SpaceContainer>
          <DevButton
            size="large"
            ghost
            onClick={() => onSubmitSeeds(mockSeeds(user?.seeds ?? {}))}
          >
            Mock Answers
          </DevButton>
          {currentStep !== 0 && (
            <Button
              size="large"
              onClick={onGoToPreviousAttribute}
              disabled={isLoading || currentStep === 0}
            >
              <Translate
                pt="Atributo anterior"
                en="Previous attribute"
              />
            </Button>
          )}

          {currentStep < seeders.length - 1 ? (
            <Button
              size="large"
              type="primary"
              onClick={onAddSeeds}
              disabled={user.ready}
            >
              <Translate
                pt="Próximo atributo"
                en="Next attribute"
              />
            </Button>
          ) : (
            <Button
              size="large"
              type="primary"
              onClick={onDoneSeeding}
              disabled={isLoading}
            >
              <Translate
                pt="Enviar análises"
                en="Submit Analyses"
              />
            </Button>
          )}
        </SpaceContainer>
      </SpaceContainer>
    </SpaceContainer>
  );
}
