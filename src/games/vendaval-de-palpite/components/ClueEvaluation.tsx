import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Space, Switch } from 'antd';
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
import { useState } from 'react';

type ClueEvaluationProps = {
  clues: VClues;
  latestBoardEntry: BoardEntry;
  onSubmitEvaluation: Function;
};

export function ClueEvaluation({ clues, latestBoardEntry, onSubmitEvaluation }: ClueEvaluationProps) {
  const [evaluation, setEvaluation] = useState<BooleanDictionary>(
    latestBoardEntry.clues.reduce((acc: BooleanDictionary, clueId) => {
      acc[clueId] = false;
      return acc;
    }, {})
  );

  const updateEvaluation = (clueId: string, value: boolean) => {
    setEvaluation((s) => ({ ...s, [clueId]: value }));
  };

  return (
    <>
      <Instruction contained>
        <Translate
          pt={
            <>
              Avalie as dicas tem ou não a ver com a palavra secreta.
              <br /> Você pode fazer perguntar para clarificar o que os jogadores quiseram dizer.
            </>
          }
          en={
            <>
              Evaluate if each of the current clues are related to the secret word. You can ask clarifying
              questions about any of them.
            </>
          }
        />
      </Instruction>

      <ul className="v-boss-evaluation">
        {Object.keys(evaluation).map((clueId) => {
          return (
            <li className="v-boss-evaluation__item">
              <Switch
                checkedChildren={
                  <>
                    <CheckOutlined /> <Translate pt="Tem a ver" en="Relates" />
                  </>
                }
                unCheckedChildren={
                  <>
                    <CloseOutlined /> <Translate pt="Nada a ver" en="Does not relate" />
                  </>
                }
                onChange={(e) => updateEvaluation(clueId, e)}
              />

              <span className="v-boss-evaluation__clue">{clues[clueId].clue}</span>
            </li>
          );
        })}

        <Space className="space-container">
          <Button type="primary" size="large" onClick={() => onSubmitEvaluation({ evaluation })}>
            <Translate pt="Enviar avaliação" en="Submit evaluation" />
          </Button>
        </Space>
      </ul>
    </>
  );
}
