import { Button, Divider, Flex, Modal, Typography } from 'antd';
import { ItemCard } from 'components/cards/ItemCard';
import { Translate } from 'components/language';
import { useState } from 'react';
import { Item } from 'types/tdr';

import { Solutions } from '../utils/types';
import { Solution } from './Solution';

type EvaluationModalProps = {
  item: Item;
  onSubmitEvaluation: (evaluation: string) => void;
  solutions: Solutions;
};

export function EvaluationModal({ item, onSubmitEvaluation, solutions }: EvaluationModalProps) {
  const [areaA, setA] = useState('');
  const [areaC, setC] = useState('');
  const [areaW, setW] = useState('');

  const evaluation = [areaA, areaW, areaC].join('') || 'O';

  return (
    <Modal
      title={<Translate en="Evaluate the item" pt="Avalie o item" />}
      open
      footer={null}
      closable={false}
    >
      <Typography.Paragraph>
        Para cada uma das áreas do diagrama, avalie se o item se encaixa ou não.
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
      />

      <Divider />

      <Button type="primary" onClick={() => onSubmitEvaluation(evaluation)}>
        <Translate en="Submit" pt="Enviar" />
      </Button>
    </Modal>
  );
}
