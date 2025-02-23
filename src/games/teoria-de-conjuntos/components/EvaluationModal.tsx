import { useState } from 'react';
// Ant Design Resources
import { Divider, Flex, Modal, Typography } from 'antd';
// Types
import type { Item } from 'types/tdr';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Components
import { SendButton } from 'components/buttons';
import { ItemCard } from 'components/cards/ItemCard';
import { Translate } from 'components/language';
// Internal
import type { Solutions } from '../utils/types';
import { Solution } from './Solution';

type EvaluationModalProps = {
  item: Item;
  onSubmitEvaluation: (evaluation: string) => void;
  solutions: Solutions;
  onCancel?: () => void;
};

export function EvaluationModal({ item, onSubmitEvaluation, solutions, onCancel }: EvaluationModalProps) {
  const [areaA, setA] = useState('');
  const [areaC, setC] = useState('');
  const [areaW, setW] = useState('');
  const { dualTranslate } = useLanguage();

  const evaluation = [areaA, areaW, areaC].join('') || 'O';

  return (
    <Modal
      title={<Translate en="Evaluate the item" pt="Avalie o item" />}
      open
      onCancel={onCancel}
      footer={null}
      closable={!!onCancel}
    >
      <Typography.Paragraph>
        <Translate
          pt="Para cada uma dos círculos do diagrama, avalie se o item se encaixa ou não."
          en="For each area of the diagram, evaluate if the item fits or not."
        />
      </Typography.Paragraph>

      <Flex justify="center">
        <ItemCard id={item.id} text={item.name} width={120} />
      </Flex>

      <Divider />

      <Solution
        solutions={solutions}
        attribute={areaA}
        word={areaW}
        context={areaC}
        setAttribute={setA}
        setWord={setW}
        setContext={setC}
        itemName={dualTranslate(item.name)}
        showHints
      />

      <Divider />

      <Flex justify="center">
        <SendButton onClick={() => onSubmitEvaluation(evaluation)}>
          <Translate en="Submit" pt="Enviar" />
        </SendButton>
      </Flex>
    </Modal>
  );
}
