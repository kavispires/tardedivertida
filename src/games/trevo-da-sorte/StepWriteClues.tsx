// Ant Design Resources
import { Button, Popconfirm, Space } from 'antd';
// Hooks
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Components
import { DebugOnly } from 'components/debug';
import { Translate } from 'components/language';
import { PopoverRule } from 'components/rules';
import { Step } from 'components/steps';
import { StepTitle } from 'components/text';
// Internal
import type { CloverObject, Leaves } from './utils/types';
import { mockClues } from './utils/mock';
import { prepareClueSubmission } from './utils/helpers';
import { useCloverState } from './utils/useCloverState';
import { Clover } from './components/Clover';
import { WritingRules } from './components/RulesBlobs';
import { ConfirmClues } from './components/ConfirmClues';

type StepWriteCluesProps = {
  clover: CloverObject;
  leaves: Leaves;
  onSubmitClues: GenericFunction;
};

export function StepWriteClues({ clover, leaves, onSubmitClues }: StepWriteCluesProps) {
  const { isLoading } = useLoading();
  const {
    mode,
    rotation,
    onRotateClover,
    clues,
    onClueChange,
    rotations,
    onLeafRotate,
    onRandomizeLeafRotations,
    areCluesComplete,
  } = useCloverState('write', clover, leaves);

  const onSubmit = () => {
    onSubmitClues({ clues: prepareClueSubmission(clues, clover, rotations) });
  };

  const onSubmitMock = () => {
    onSubmitClues({ clues: prepareClueSubmission(mockClues(clover, leaves, rotations), clover, rotations) });
  };

  useMock(() => {
    onSubmitClues({ clues: prepareClueSubmission(mockClues(clover, leaves, rotations), clover, rotations) });
  });

  return (
    <Step fullWidth>
      <StepTitle>
        <Translate pt="Escreva as dicas" en="Write clues" />
      </StepTitle>

      <WritingRules />

      <PopoverRule content={<WritingRules />} />

      <Space className="space-container" align="center">
        <Button type="default" size="large" onClick={onRandomizeLeafRotations} disabled={isLoading}>
          <Translate pt="Chacoalhar cartas" en="Randomize rotations" />
        </Button>
      </Space>

      <Clover
        mode={mode}
        clover={clover}
        leaves={leaves}
        rotation={rotation}
        onRotate={onRotateClover}
        onClueChange={onClueChange}
        rotations={rotations}
        onLeafRotate={onLeafRotate}
      />

      <Space className="space-container" align="center">
        <Popconfirm
          title={<ConfirmClues clover={clover} leaves={leaves} clues={clues} rotations={rotations} />}
          disabled={!areCluesComplete || isLoading}
          onConfirm={onSubmit}
        >
          <Button
            type="primary"
            size="large"
            disabled={!areCluesComplete || isLoading}
            onClick={() => onRotateClover((rotation / 90) * -1)}
          >
            <Translate pt="Enviar dicas" en="Submit clues" />
          </Button>
        </Popconfirm>

        <DebugOnly devOnly>
          <Button size="large" onClick={onSubmitMock}>
            Mock clues
          </Button>
        </DebugOnly>
      </Space>
    </Step>
  );
}
