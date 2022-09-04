// Ant Design Resources
import { Button, Space } from 'antd';
// Hooks
import { useCloverState } from './utils/useCloverState';
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Utils
import { mockClues } from './utils/mock';
// Components
import { DebugOnly } from 'components/debug';
import { Translate } from 'components/language';
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Clover } from './components/Clover';

type StepWriteCluesProps = {
  clover: Clover;
  leaves: Leaves;
  onSubmitClues: GenericFunction;
};

export function StepWriteClues({ clover, leaves, onSubmitClues }: StepWriteCluesProps) {
  const { isLoading } = useLoading();
  const { rotation, onRotateClover, onChangeClue, clues, guesses, allowLeafRotation, isCluesComplete } =
    useCloverState('write', clover, leaves);

  const onSubmit = () => {
    onSubmitClues({ clues });
  };
  const onSubmitMock = () => {
    onSubmitClues(mockClues());
  };

  useMock(() => {
    onSubmitClues(mockClues());
  });

  return (
    <Step fullWidth>
      <Title size="medium">
        <Translate pt="Escreva as dicas" en="Write clues" />
      </Title>
      <Instruction contained>
        <Translate
          pt={
            <>
              Escreva uma dica para cada um dos pares de palavras na parte de fora do trevo
              <br />
              Você pode girar o trevo para ficar mais fácil de escrever
            </>
          }
          en={
            <>
              Write a clue for each pair of clues in the outer side of the clover
              <br />
              You may rotate the clover before writing
            </>
          }
        />
      </Instruction>

      <Clover
        leaves={leaves}
        clues={clues}
        rotation={rotation}
        guesses={guesses}
        allowLeafRotation={allowLeafRotation}
        onRotateClover={onRotateClover}
        onChangeClue={onChangeClue}
      />

      <Space className="space-container" align="center">
        <Button type="primary" size="large" onClick={onSubmit} disabled={!isCluesComplete || isLoading}>
          <Translate pt="Enviar dicas" en="Submit clues" />
        </Button>

        <DebugOnly devOnly>
          <Button size="large" onClick={onSubmitMock}>
            Mock clues
          </Button>
        </DebugOnly>
      </Space>
    </Step>
  );
}
