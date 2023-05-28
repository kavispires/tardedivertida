// Components
import { IconAvatar } from 'components/avatars';
import { Translate } from 'components/language';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
import { Title } from 'components/text';
import { BoxBlankIcon } from 'icons/BoxBlankIcon';
import { BoxCheckMarkIcon } from 'icons/BoxCheckMarkIcon';
import { BoxQuestionMarkIcon } from 'icons/BoxQuestionMarkIcon';
import { BoxXIcon } from 'icons/BoxXIcon';

type GroupProgressProps = {
  group: GroupProgress;
};

export function GroupProgress({ group }: GroupProgressProps) {
  const attempts = Array(10)
    .fill(0)
    .map((e, i) => group.attempts?.[e + i] ?? 'UNKNOWN');

  return (
    <div className="u-group-progress">
      <Title size="xx-small" level={5} className="u-group-progress__title">
        <Translate pt="Progresso:" en="Group Progress" />
      </Title>
      <ol className="u-group-progress__bar">
        {attempts.map((value, index) => {
          const key = `attempt-${index}`;
          return (
            <li className="u-group-progress__item" key={key}>
              <div className="u-group-progress__label">{index + 1}</div>
              <div className="u-group-progress__result">
                {value === 'CORRECT' && <IconAvatar icon={<BoxCheckMarkIcon />} />}
                {value === 'WRONG' && <IconAvatar icon={<BoxXIcon />} />}
                {value === 'PASS' && <IconAvatar icon={<BoxBlankIcon />} />}
                {value === 'UNKNOWN' && (
                  <IconAvatar icon={<BoxQuestionMarkIcon />} className="u-group-progress__unknown" />
                )}
              </div>
            </li>
          );
        })}
      </ol>
      <span>
        <Translate pt="Pontuação:" en="Score:" />
        <PointsHighlight>
          {group.score ?? 0}/{group.goal}
        </PointsHighlight>
      </span>
    </div>
  );
}
