import clsx from 'clsx';
import { orderBy } from 'lodash';
import { useMemo, useState } from 'react';
// Ant Design Resources
import { Badge, Button, Flex, Steps, Switch, Typography, type StepsProps } from 'antd';
// Types
import type { GamePlayer } from 'types/game';
// Hooks
import { useBooleanDictionary } from '@hooks/useBooleanDictionary';
import { useLanguage } from '@hooks/useLanguage';
import { useLoading } from '@hooks/useLoading';
// Utils
import { SEPARATOR } from '@utils/constants';
import { getAnimationClass } from '@utils/helpers';
// Components
import { ItemCard } from '@components/cards/ItemCard';
import { TextCard } from '@components/cards/TextCard';
import { DevButton } from '@components/debug/DevButton';
import { DualTranslate } from '@components/language/DualTranslate';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { Surface } from '@components/layout/Surface';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { Title } from '@components/text/Title';
import { alienAttributesUtils } from '@components/toolKits/AlienAttributes';
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
            en="Analysis"
            pt="Análise"
          />
        </Title>
        <RuleInstruction type="action">
          <Translate
            en="Activate the switch of all items that have the attribute"
            pt="Ative o botão de todos os itens que possuem a característica:"
          />
        </RuleInstruction>

        <SpaceContainer vertical>
          <TextCard
            className={clsx('attribute-card', getAnimationClass('tada'))}
            key={seed.attribute.id}
          >
            <Flex vertical>
              <DualTranslate>{seed.attribute.name}</DualTranslate>
              <small>
                <em>
                  <DualTranslate>{seed.attribute.description}</DualTranslate>
                </em>
              </small>
            </Flex>
          </TextCard>
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
                      en="Yes"
                      pt="Sim"
                    />
                  }
                  unCheckedChildren={
                    <Translate
                      en="No"
                      pt="Não"
                    />
                  }
                  onChange={() => updateSelected(key)}
                  checked={selected[key]}
                />
              </Flex>
            );
          })}
        </Flex>

        <Surface>
          <Translate
            en="If no item matches the attribute, just go to the next one."
            pt="Se nenhum item combina com a característica, apenas vá para o próximo."
          />
        </Surface>

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
                en="Previous attribute"
                pt="Atributo anterior"
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
                en="Next attribute"
                pt="Próximo atributo"
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
                en="Submit Analyses"
                pt="Enviar análises"
              />
            </Button>
          )}
        </SpaceContainer>
      </SpaceContainer>
    </SpaceContainer>
  );
}
