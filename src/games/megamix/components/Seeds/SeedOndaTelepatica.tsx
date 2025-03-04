import { useState } from 'react';
// Ant Design Resources
import { Button, Input, Space } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Components
import { Card } from 'components/cards';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { Instruction, Title } from 'components/text';
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
      <Title size="xx-small" colorScheme="light">
        <Translate
          pt="Você ainda estuda e precisa terminar sua tarefa de casa..."
          en="You're still in school and needs to finish your homework..."
        />
      </Title>

      <SpaceContainer vertical>
        <Instruction className="seed-instruction">
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
        </Instruction>

        <Card header={translate('Tarefa', 'Homework')} color="purple">
          {/* TODO: Verify */}
          {String(seed.card)}
        </Card>

        <Input
          onChange={(e) => setValue(e.target.value)}
          size="large"
          placeholder={translate('Escreva aqui', 'Write here')}
          onPressEnter={() => updateData({ wave: value }, true)}
        />

        <Space>
          <Button
            disabled={value.length < 2}
            onClick={() => updateData({ wave: value }, true)}
            type="primary"
          >
            <Translate pt="Enviar dever de casa" en="Submit homework" />
          </Button>
        </Space>
      </SpaceContainer>
    </div>
  );
}
