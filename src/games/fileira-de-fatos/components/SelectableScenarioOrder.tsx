import { findLastIndex } from 'lodash';
import { useState } from 'react';
// Ant Design Resources
import { RiseOutlined, UndoOutlined } from '@ant-design/icons';
import { Button } from 'antd';
// Types
import type { TextCard } from 'types/tdr';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
import { useLoading } from 'hooks/useLoading';
// Components
import { TransparentButton } from 'components/buttons';
import { DevButton } from 'components/debug';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { RuleInstruction } from 'components/text';
// Internal
import type { OnSubmitOrder } from '../utils/types';
import { getReference } from '../utils/helpers';
import { mockOrder } from '../utils/mock';
import { Scenarios } from './Scenarios';

type SelectableScenarioOrderProps = {
  scenarios: TextCard[];
  kind: 'positive' | 'negative';
  onSubmitOrder: OnSubmitOrder;
};

export function SelectableScenarioOrder({ scenarios, kind, onSubmitOrder }: SelectableScenarioOrderProps) {
  const { isLoading } = useLoading();
  const width = useCardWidth(8, {
    gap: 16,
    minWidth: 100,
    maxWidth: 200,
    margin: 32,
  });
  const reference = getReference(kind);

  const [selection, setSelection] = useState<(null | TextCard)[]>(Array(scenarios.length).fill(null));

  const availableScenarios = scenarios.filter((card) => !selection.includes(card));

  const onAddScenario = (card: TextCard) => {
    setSelection((selection) => {
      const newSelection = [...selection];
      const firstNullIndex = newSelection.findIndex((entry) => entry === null);
      newSelection[firstNullIndex] = card;
      return newSelection;
    });
  };

  const onRemoveScenario = () => {
    setSelection((selection) => {
      const newSelection = [...selection];
      const lastCardIndex = findLastIndex(newSelection, (entry) => entry !== null);
      newSelection[lastCardIndex] = null;
      return newSelection;
    });
  };

  const onSubmit = () => {
    const orderedScenarios = selection.map((card) => card?.id ?? '');
    onSubmitOrder({ order: orderedScenarios });
  };

  return (
    <SpaceContainer vertical>
      <Scenarios scenarios={selection} reference={reference} />

      <RuleInstruction type="rule">
        <Translate
          pt="Você deve escolher os cenários em ordem do menos pior para o pior. Você pode desfazer a seleção, se precisar. Quando estiver pronto(a), clique em 'Enviar'."
          en="You must choose the scenarios in order from the least bad to the worst. You may undo your selection if needed. When you're ready, click 'Submit'."
        />
      </RuleInstruction>

      <div className="scenarios-buttons">
        {availableScenarios.map((card) => (
          <TransparentButton
            className="scenarios-buttons__button"
            key={`scenario-${card.id}`}
            onClick={() => onAddScenario(card)}
            style={{ width: `${width}px` }}
          >
            {card.text}
          </TransparentButton>
        ))}
      </div>

      <SpaceContainer>
        <Button
          size="large"
          onClick={onRemoveScenario}
          icon={<UndoOutlined />}
          disabled={selection[0] === null}
        >
          <Translate pt="Desfazer" en="Undo" />
        </Button>

        <DevButton size="large" type="dashed" ghost onClick={() => setSelection(mockOrder(scenarios))}>
          Auto-select
        </DevButton>

        <Button
          size="large"
          type="primary"
          onClick={onSubmit}
          icon={<RiseOutlined />}
          disabled={selection.some((entry) => entry === null) || isLoading}
        >
          <Translate pt="Enviar" en="Submit" />
        </Button>
      </SpaceContainer>
    </SpaceContainer>
  );
}
