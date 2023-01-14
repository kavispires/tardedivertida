import { Fragment } from 'react';
// AntDesign Resources
import { RightSquareOutlined } from '@ant-design/icons';
// Utils
import { LETTERS } from 'utils/constants';
// Components
import { IconAvatar } from 'components/icons/IconAvatar';
import { MapIcon } from 'components/icons/MapIcon';
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
import { WinningCount } from './WinningCount';

export function ResultCaminhosMagicos({ task, winningValues, winningTeam }: ResultComponentProps) {
  return (
    <>
      <WinningCount>{winningTeam.length}</WinningCount>
      <Instruction>
        <Translate pt="O caminho mais votado foi" en="The most popular path was" />:
      </Instruction>
      <div className="task-result-values__cards">
        {winningValues.map((value) => {
          const index = Number(value);
          const entry = task.data?.options?.[index] ?? {};
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
