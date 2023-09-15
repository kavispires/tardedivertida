import { useState } from 'react';
// AntDesign Resources
import { Button, Input, Space } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Components
import { Card } from 'components/cards';
import { Translate } from 'components/language';
import { Instruction, Title } from 'components/text';

type SeedOndaTelepaticaProps = {
  seed: SeedEntryOndaTelepatica;
  updateData: GenericComponent;
};

const leftSide = Math.random() > 0.5;

export function SeedOndaTelepatica({ seed, updateData }: SeedOndaTelepaticaProps) {
  const [value, setValue] = useState('');
  const { translate } = useLanguage();
  const theme = leftSide ? seed.card.left : seed.card.right;
  return (
    <div className="seed-container">
      <Title size="xx-small">
        <Translate
          pt="Você ainda estuda e precisa terminar sua tarefa de casa..."
          en="You're still in school and needs to finish your homework..."
        />
      </Title>

      <Space className="space-container" direction="vertical">
        <Instruction className="seed-instruction">
          <Translate
            pt={
              <>
                Escreva algo simples que combine com o tema abaixo, pode ser uma palavra, duas, uma expressão.
              </>
            }
            en={
              <>Write something simple that matches the theme below. It could be a word, two, or a phrase.</>
            }
          />
        </Instruction>

        <Card header={translate('Tarefa', 'Homework')} color="purple">
          {theme}
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
      </Space>
    </div>
  );
}
