import { useState } from 'react';
// AntDesign Resources
import { Button, Input, Space } from 'antd';
// Types
import type { SeedEntryParty } from '../../utils/types';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Utils
// Components
import { DualTranslate, Translate } from 'components/language';
import { Instruction, RuleInstruction, Title } from 'components/text';

type SeedPartyProps = {
  seed: SeedEntryParty;
  updateData: GenericComponent;
};

export function SeedParty({ seed, updateData }: SeedPartyProps) {
  const { translate } = useLanguage();
  const [answers, setAnswers] = useState<StringDictionary>({});

  const updateAnswers = (key: string, value: string) => {
    setAnswers((v) => ({ ...v, [key]: value }));
  };

  return (
    <div className="seed-container">
      <Title size="xx-small">
        <Translate pt="Responda as perguntas a seguir" en="Answer the following prompts" />
      </Title>

      <Space className="space-container" direction="vertical">
        <RuleInstruction type="rule">
          <Translate
            pt={
              <>
                Seja criativo nas respostas, porém evite palavras que possam entregar sua identidade.
                <br />
                Nem todas as repostar serão utilizadas no jogo.
              </>
            }
            en={
              <>
                Be creative, but avoid words that may give away your identity.
                <br />
                Not all answers will be used in the game.
              </>
            }
          />
        </RuleInstruction>

        <Instruction contained>
          <Space direction="vertical">
            {seed.cards.map((card) => {
              return (
                <div className="" key={card.id}>
                  <label htmlFor={`input-${card.id}`}>
                    <DualTranslate>{card.text}</DualTranslate>
                  </label>
                  <Input
                    id={`input-${card.id}`}
                    size="large"
                    value={answers?.[card?.id] ?? ''}
                    placeholder={translate('Escreva aqui', 'Write here')}
                    onChange={(event) => updateAnswers(card.id, event.target.value)}
                  />
                </div>
              );
            })}
          </Space>
        </Instruction>

        <Button
          block
          onClick={() => updateData({ partyAnswers: answers }, true)}
          type="primary"
          disabled={Object.keys(answers).length < seed.cards.length}
        >
          <Translate pt="Enviar" en="Submit" />
        </Button>
      </Space>
    </div>
  );
}
