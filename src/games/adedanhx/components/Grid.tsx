import clsx from 'clsx';
import { Fragment, useMemo } from 'react';
// Ant Design Resources
import { LockFilled, UnlockFilled } from '@ant-design/icons';
import { Divider, Input, Popover, Switch } from 'antd';
// Types
import type { GamePlayers } from 'types/player';
import type { TopicCard } from 'types/tdr';
// Utils
import { NOOP } from 'utils/constants';
// Icons
import { BoxQuestionMarkIcon } from 'icons/BoxQuestionMarkIcon';
import { BoxXIcon } from 'icons/BoxXIcon';
import { NoIcon } from 'icons/NoIcon';
import { SpeechBubbleThumbsDownIcon } from 'icons/SpeechBubbleThumbsDownIcon';
import { SpeechBubbleThumbsUpIcon } from 'icons/SpeechBubbleThumbsUpIcon';
// Components
import { Avatar, AvatarName, IconAvatar } from 'components/avatars';
import { Translate } from 'components/language';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
// Internal
import type {
  AdedanhxGrid,
  Answer,
  AnswerGridEntry,
  GroupAnswerEvaluationEntry,
  LetterEntry,
} from '../utils/types';
import { CategoryIcon } from './CategoryIcon';

type GridProps = {
  grid: AdedanhxGrid;
  answers: Record<string, Answer>;
  updateAnswer: (id: string, answer: string) => void;
  toggleLock: (id: string) => void;
};

export function Grid({ grid, answers, updateAnswer, toggleLock }: GridProps) {
  const gridMap = useMemo(() => {
    const m = new Array((grid.xHeaders.length + 1) * (grid.yHeaders.length + 1)).fill(0).map((e, i) => {
      const x = i % (grid.xHeaders.length + 1);
      const y = Math.floor(i / (grid.xHeaders.length + 1));
      if (x === 0 && y === 0) return { type: 'corner' };
      if (x === 0) return grid.yHeaders[y - 1];
      if (y === 0) return grid.xHeaders[x - 1];
      return { id: `${x - 1}-${y - 1}`, type: 'cell' };
    });
    return m;
  }, [grid.xHeaders, grid.yHeaders]);

  return (
    <div
      className="adedanhx-grid"
      style={{
        gridTemplateColumns: `auto repeat(${grid.xHeaders.length}, 1fr)`,
        gridTemplateRows: `auto repeat(${grid.yHeaders.length}, 1fr)`,
      }}
    >
      {gridMap.map((element: PlainObject) => {
        const key = String((element?.letters || element?.label || element.id) ?? element.type);

        let CellComponent = CornerCell;
        if (element?.letters) CellComponent = LetterCell;
        if (element?.label) CellComponent = CategoryCell;
        if (element?.type === 'cell') CellComponent = WritingCell;

        return (
          <CellComponent
            key={key}
            data={element}
            toggleLock={toggleLock}
            updateAnswer={updateAnswer}
            answer={answers?.[element?.id]}
          />
        );
      })}
    </div>
  );
}

type AnswersGridProps = {
  players: GamePlayers;
  grid: AdedanhxGrid;
  answersGrid: Record<string, AnswerGridEntry>;
  answersGroups: GroupAnswerEvaluationEntry[];
};
export function AnswersGrid({ grid, players, answersGrid, answersGroups }: AnswersGridProps) {
  const gridMap = useMemo(() => {
    const m = new Array((grid.xHeaders.length + 1) * (grid.yHeaders.length + 1)).fill(0).map((e, i) => {
      const x = i % (grid.xHeaders.length + 1);
      const y = Math.floor(i / (grid.xHeaders.length + 1));
      if (x === 0 && y === 0) return { type: 'corner' };
      if (x === 0) return grid.yHeaders[y - 1];
      if (y === 0) return grid.xHeaders[x - 1];
      const groupId = `${x - 1}-${y - 1}`;
      const answer = answersGrid[groupId];

      return { id: `${x - 1}-${y - 1}`, type: 'cell', result: answer };
    });
    return m;
  }, [grid.xHeaders, grid.yHeaders, answersGrid]);

  return (
    <div
      className="adedanhx-grid"
      style={{
        gridTemplateColumns: `auto repeat(${grid.xHeaders.length}, 1fr)`,
        gridTemplateRows: `auto repeat(${grid.yHeaders.length}, 1fr)`,
      }}
    >
      {gridMap.map((element: PlainObject) => {
        const key = String((element?.letters || element?.label || element.id) ?? element.type);

        let CellComponent = CornerCell;
        if (element?.letters) CellComponent = LetterCell;
        if (element?.label) CellComponent = CategoryCell;
        if (element?.type === 'cell') {
          CellComponent = ResultCell;
          element.groupAnswer = answersGroups.find((g) => g.id === element.id);
        }

        return <CellComponent key={key} data={element} updateAnswer={NOOP} players={players} />;
      })}
    </div>
  );
}

type Cell = {
  type: 'cell';
  id: string;
};

type TResultCell = {
  result: AnswerGridEntry;
  groupAnswer: GroupAnswerEvaluationEntry;
} & Cell;

type CellProps = {
  data: TopicCard | LetterEntry | Cell | PlainObject | TResultCell;
  answer?: Answer;
  toggleLock?: (id: string) => void;
  updateAnswer: (id: string, answer: string) => void;
  players?: GamePlayers;
};

function CornerCell(_: CellProps) {
  return <div className={clsx('adedanhx-grid-cell adedanhx-grid-cell__corner')}>.</div>;
}

export function CategoryCell({ data }: CellProps) {
  const { label, category, level } = data as TopicCard;
  return (
    <div className={clsx('adedanhx-grid-cell adedanhx-grid-cell__header')}>
      <span className="adedanhx-grid-cell__category-icon">
        <CategoryIcon category={category} />
      </span>
      <span className="adedanhx-grid-cell__category-label">{label}</span>
      <span className="adedanhx-grid-cell__level">{Array(level).fill('✰').join('')}</span>
    </div>
  );
}

export function LetterCell({ data }: CellProps) {
  const { letters, level, type } = data as LetterEntry;
  return (
    <div className={clsx('adedanhx-grid-cell adedanhx-grid-cell__header')}>
      <span className={clsx('adedanhx-grid-cell__letters-type', `adedanhx-grid-cell__letters-type--${type}`)}>
        {type === 'ends-with' && <Translate pt="Termina com" en="Ends with" />}
        {type === 'includes' && <Translate pt="Contém" en="Includes" />}
      </span>
      <span className="adedanhx-grid-cell__letters-label">
        {type === 'ends-with' && '-'}
        {letters}
      </span>

      <span className="adedanhx-grid-cell__level">{Array(level).fill('✰').join('')}</span>
    </div>
  );
}

function WritingCell({ data, answer, toggleLock = () => {}, updateAnswer }: CellProps) {
  const { id } = data as Cell;
  const isLocked = (answer?.timestamp ?? 0) > 0;

  return (
    <div className={clsx('adedanhx-grid-cell adedanhx-grid-cell__writing')}>
      <Input
        className="adedanhx-grid-cell__input"
        placeholder="?"
        onChange={(e) => updateAnswer(id, e.target.value)}
        disabled={isLocked}
      />
      <Switch
        checkedChildren={<LockFilled />}
        unCheckedChildren={<UnlockFilled />}
        onClick={() => toggleLock(id)}
        disabled={!answer?.answer}
      />
    </div>
  );
}

function ResultCell({ data, players }: CellProps) {
  const { result, groupAnswer } = data as TResultCell;

  if (!groupAnswer || groupAnswer?.answers?.length === 0 || !players) {
    return (
      <Popover content={<Translate pt="Ninguém respondeu essa" en="Nobody has answered this one" />}>
        <div className={clsx('adedanhx-grid-cell adedanhx-grid-cell__results')}>
          <IconAvatar icon={<BoxQuestionMarkIcon />} size="large" />
        </div>
      </Popover>
    );
  }

  if (groupAnswer?.answers?.length > 0 && !result) {
    return (
      <Popover content={<PopoverResult groupAnswer={groupAnswer} players={players} />}>
        <div className={clsx('adedanhx-grid-cell adedanhx-grid-cell__results')}>
          <IconAvatar icon={<BoxXIcon />} size="large" />
        </div>
      </Popover>
    );
  }

  return (
    <Popover content={<PopoverResult groupAnswer={groupAnswer} players={players} />}>
      <div className={clsx('adedanhx-grid-cell adedanhx-grid-cell__results')}>
        <span className="adedanhx-grid-cell__results-player">
          <AvatarName player={players[result.main.playerId]} />
        </span>
        <span className="adedanhx-grid-cell__results-answer">"{result.main.answer}"</span>
        <span className="adedanhx-grid-cell__results-score">
          <PointsHighlight type="positive">{result.main.score}</PointsHighlight>
        </span>

        <Divider className="adedanhx-grid-cell__results-divider" />
        <span className="adedanhx-grid-cell__results-players">
          <div>
            <PointsHighlight>{result.score}</PointsHighlight>{' '}
          </div>

          {result.playerIds.map((playerId) => (
            <Avatar
              key={`${result.id}-${playerId}`}
              id={players[playerId].avatarId}
              alt={players[playerId].name}
              size="small"
            />
          ))}
        </span>
      </div>
    </Popover>
  );
}

type PopoverResultProps = {
  groupAnswer: GroupAnswerEvaluationEntry;
  players: GamePlayers;
};

function PopoverResult({ groupAnswer, players }: PopoverResultProps) {
  return (
    <ul className="popover-results">
      {groupAnswer.answers.map((answer) => (
        <Fragment key={answer.id}>
          <AvatarName player={players[answer.playerId]} />
          <span>{answer.answer}</span>
          {answer.autoRejected && <IconAvatar icon={<NoIcon />} size="small" />}
          {answer.rejected && <IconAvatar icon={<SpeechBubbleThumbsDownIcon />} size="small" />}
          {!answer.rejected && !answer.autoRejected && (
            <IconAvatar icon={<SpeechBubbleThumbsUpIcon />} size="small" />
          )}
        </Fragment>
      ))}
    </ul>
  );
}
