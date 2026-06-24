import { Fragment } from 'react';
// Ant Design Resources
import { RightSquareOutlined } from '@ant-design/icons';
// Utils
import { LETTERS } from '@utils/constants';
// Icons
import { MapIcon } from '@icons/MapIcon';
// Components
import { Icon } from '@components/general/Icon';
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
// Internal
import type { ResultComponentProps } from '../../utils/types';

export function ResultLabirintoSecreto({ track, winningValues }: ResultComponentProps) {
  return (
    <>
      <Surface>
        <Translate
          pt="O caminho mais votado foi"
          en="The most popular path was"
        />
        :
      </Surface>
      <div className="track-result-values__cards">
        {winningValues.map((value) => {
          const index = Number(value);
          const entry = track.data?.options?.[index] ?? {};
          return (
            <div
              key={index}
              className="cm-clues__clue cm-clues__clue--small"
            >
              {LETTERS[Number(value)]}
              <Icon
                icon={<MapIcon />}
                size={48}
              />
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
