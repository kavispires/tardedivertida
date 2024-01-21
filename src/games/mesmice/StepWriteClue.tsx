import { useMemo, useState } from 'react';
import { orderBy } from 'lodash';
// Ant Design Resources
import { Button, Input, Space } from 'antd';
// Type
import type { GamePlayer } from 'types/player';
import { type UseStep } from 'hooks/useStep';
import type { ExtendedObjectFeatureCard, ObjectCardObj, SubmitObjectPayload } from './utils/types';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
import { useMock } from 'hooks/useMock';
import { useLoading } from 'hooks/useLoading';
// Utils
import { mockClue } from 'mock/clues';
// Components
import { Step } from 'components/steps';
import { RuleInstruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { ObjectFeature } from './components/ObjectFeature';
import { ObjectCard } from './components/ObjectCard';

type StepWriteClueProps = {
  user: GamePlayer;
  features: Dictionary<ExtendedObjectFeatureCard>;
  goToPreviousStep: UseStep['goToPreviousStep'];
  selectedObjectId: string;
  onSubmitClue: (payload: SubmitObjectPayload) => void;
};

export function StepWriteClue({
  user,
  features,
  goToPreviousStep,
  onSubmitClue,
  selectedObjectId,
}: StepWriteClueProps) {
  const [clue, setClue] = useState<string>('');
  const { translate, language } = useLanguage();
  const { isLoading } = useLoading();

  // Dev Only
  useMock(() => onSubmitClue({ clue: mockClue('high'), itemId: selectedObjectId }));

  const selectedObject = useMemo(
    () => user.items.find((item: ObjectCardObj) => item.id === selectedObjectId),
    [user, selectedObjectId]
  );

  const handleSubmitClue = () => {
    onSubmitClue({ clue: clue.trim(), itemId: selectedObjectId });
  };

  const listOfFeatures = useMemo(
    () => orderBy(Object.values(features), [`title.${language}`, 'level']),
    [features, language]
  );

  return (
    <Step fullWidth>
      <Title>
        <Translate pt={<>Escreva sua dica</>} en={<>Write Your Clue</>} />
      </Title>

      <RuleInstruction type="action">
        <Translate
          pt={
            <>
              Com o objeto selecionado, <strong>escreva</strong> uma dica que melhor conecta seu objeto com a
              característica sorteada para você (destacada em rosa abaixo).
              <br />O jogo consiste em eliminar as características restantes até que apenas a sua permaneça.
            </>
          }
          en={
            <>
              With the selected object, <strong>write</strong> a clue that best connects your object with the
              drawn characteristic for you (highlighted in pink below).
              <br />
              The game consists of eliminating the remaining characteristics until only yours remains.
            </>
          }
        />
      </RuleInstruction>

      <div className="selections-container">
        <div>
          <ObjectCard item={selectedObject} />
        </div>
        <div
          className="features-container"
          style={{ gridTemplateColumns: `repeat(${listOfFeatures.length / 2}, 1fr)` }}
        >
          {listOfFeatures.map((feature) => (
            <ObjectFeature key={feature.id} feature={feature} highlight={user.target === feature.id} />
          ))}
        </div>
      </div>

      <RuleInstruction type="rule">
        <Translate
          pt={
            <>
              A dica que você escrever deve ser um objeto manufaturado que você possa tocar.
              <br />
              Você não pode usar números e nenhuma palavra adicional além do objeto.
              <br />
              Não pode conter nenhum material. (Por exemplo, colher é válido, mas colher de pau não é)
              <br />
              Em geral, se você tiver a sensação de que está trapaceando, provavelmente está.
            </>
          }
          en={
            <>
              The clue object you write must be an man-made object you can touch.
              <br />
              You cannot use numbers and no additional words apart from the object.
              <br />
              It may not contain any material. (For example, cooking spoon is valid, but wooden spoon is not)
              <br />
              In general, if you have the feeling you are cheating, you probably are.
            </>
          }
        />
      </RuleInstruction>

      <Space className="space-container">
        <Input
          size="large"
          placeholder={translate('Escreva seu objeto aqui', 'Write your object here')}
          onChange={(e) => setClue(e.target.value)}
          onPressEnter={handleSubmitClue}
        />
      </Space>

      <Space className="space-container">
        <Button onClick={goToPreviousStep}>
          <Translate pt="Voltar" en="Back" />
        </Button>
        <Button type="primary" onClick={handleSubmitClue} disabled={isLoading}>
          <Translate pt="Enviar" en="Submit" />
        </Button>
      </Space>
    </Step>
  );
}
