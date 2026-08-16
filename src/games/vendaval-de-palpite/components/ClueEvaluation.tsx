import { useState } from 'react';
// Ant Design Resources
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Switch } from 'antd';
// Components
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { Surface } from '@components/layout/Surface';
// Internal
import type { Clues, BoardEntry } from '../utils/types';

type ClueEvaluationProps = {
  clues: Clues;
  latestBoardEntry: BoardEntry;
  onSubmitEvaluation: GenericFunction;
};

export function ClueEvaluation({ clues, latestBoardEntry, onSubmitEvaluation }: ClueEvaluationProps) {
  const [evaluation, setEvaluation] = useState<Dictionary<boolean>>(
    latestBoardEntry.clues.reduce((acc: Dictionary<boolean>, clueId) => {
      acc[clueId] = false;
      return acc;
    }, {}),
  );

  const updateEvaluation = (clueId: string, value: boolean) => {
    setEvaluation((s) => ({ ...s, [clueId]: value }));
  };

  return (
    <>
      <Surface contained>
        <Translate
          pt="Avalie as dicas tem ou não a ver com a palavra secreta. <br /> Você pode fazer perguntar para clarificar o que os jogadores quiseram dizer."
          en="Evaluate if each of the current clues are related to the secret word. You can ask clarifying questions about any of them."
        />
      </Surface>

      <ul className="v-boss-evaluation">
        {Object.keys(evaluation).map((clueId) => {
          return (
            <li
              key={clueId}
              className="v-boss-evaluation__item"
            >
              <Switch
                checkedChildren={
                  <>
                    <CheckOutlined />{' '}
                    <Translate
                      pt="Tem a ver"
                      en="Relates"
                    />
                  </>
                }
                unCheckedChildren={
                  <>
                    <CloseOutlined />{' '}
                    <Translate
                      pt="Nada a ver"
                      en="Does not relate"
                    />
                  </>
                }
                onChange={(e) => updateEvaluation(clueId, e)}
              />

              <span className="v-boss-evaluation__clue">{clues[clueId].clue}</span>
            </li>
          );
        })}

        <SpaceContainer>
          <Button
            type="primary"
            size="large"
            onClick={() => onSubmitEvaluation({ evaluation })}
          >
            <Translate
              pt="Enviar avaliação"
              en="Submit evaluation"
            />
          </Button>
        </SpaceContainer>
      </ul>
    </>
  );
}
