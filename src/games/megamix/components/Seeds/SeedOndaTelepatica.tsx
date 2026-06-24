import { useState } from 'react';
// Ant Design Resources
import { Button, Input, Space } from 'antd';
// Hooks
import { useLanguage } from '@hooks/useLanguage';
// Components
import { TextCard } from '@components/cards/TextCard';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { Surface } from '@components/layout/Surface';
import { Title } from '@components/text/Title';
// Internal
import type { SeedEntryOndaTelepatica } from '../../utils/types';

type SeedOndaTelepaticaProps = {
  seed: SeedEntryOndaTelepatica;
  updateData: GenericComponent;
};

export function SeedOndaTelepatica({ seed, updateData }: SeedOndaTelepaticaProps) {
  const [value, setValue] = useState('');
  const { translate } = useLanguage();

  return (
    <div className="seed-container">
      <Title
        size="xx-small"
        colorScheme="light"
      >
        <Translate
          pt="Você ainda estuda e precisa terminar sua tarefa de casa..."
          en="You're still in school and needs to finish your homework..."
        />
      </Title>

      <SpaceContainer vertical>
        <Surface className="seed-instruction">
          <Translate
            pt={
              <>
                A tarefa é escrever algo simples relacionado ao tema abaixo, pode ser uma palavra, duas, uma
                expressão.
                <br />
                Vamos tira 10!
              </>
            }
            en={
              <>
                The task is easy: Write something simple that matches the theme below. It could be a word,
                two, or a phrase.
                <br />
                Let's get that A+!
              </>
            }
          />
        </Surface>

        <TextCard
          header={translate({ pt: 'Tarefa', en: 'Homework' })}
          color="purple"
        >
          {/* TODO: Verify */}
          {String(seed.card)}
        </TextCard>

        <Input
          onChange={(e) => setValue(e.target.value)}
          size="large"
          placeholder={translate({ pt: 'Escreva aqui', en: 'Write here' })}
          onPressEnter={() => updateData({ wave: value }, true)}
        />

        <Space>
          <Button
            disabled={value.length < 2}
            onClick={() => updateData({ wave: value }, true)}
            type="primary"
          >
            <Translate
              pt="Enviar dever de casa"
              en="Submit homework"
            />
          </Button>
        </Space>
      </SpaceContainer>
    </div>
  );
}
