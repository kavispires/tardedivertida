import { RightSquareOutlined } from '@ant-design/icons';

import { IconAvatar } from 'components/icons/IconAvatar';
import { MapIcon } from 'components/icons/MapIcon';
import { Translate } from 'components/language';
import { Instruction } from 'components/text';

import { Fragment } from 'react';
import { LETTERS } from 'utils/constants';

export function ResultCaminhosMagicos({ task, winningValues }: ResultComponentProps) {
  return (
    <>
      <Instruction>
        <Translate pt="A arte mais votada foi" en="The most popular art was" />:
      </Instruction>
      <div className="task-result-values__cards">
        {winningValues.map((value) => {
          const index = Number(value);
          const entry = task.data.options[index];
          return (
            <div key={index} className="cm-clues__clue">
              {LETTERS[Number(value)]}
              <IconAvatar icon={<MapIcon />} size={48} />
              {Object.values<PlainObject>(entry).map((option, index, arr) => {
                return (
                  <Fragment key={`${option.playerId}-${index}`}>
                    <span className="cm-clues__clue-text">{option.text}</span>
                    {arr.length - 1 > index && <RightSquareOutlined />}
                  </Fragment>
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
}
