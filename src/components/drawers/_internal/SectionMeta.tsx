// Ant Design Resources
import { Avatar } from 'antd';
// Types
import type { GameRound } from 'types/game';
// Components
import { Translate } from 'components/language/Translate';
// Sass
import styles from '../drawers.module.scss';

type SectionMetaProps = {
  round: GameRound;
  groupScore?: number;
};

export function SectionMeta({ round, groupScore }: SectionMetaProps) {
  return (
    <ul className={styles.gameInfoDrawer__meta}>
      <li>
        <div className={styles.gameInfoDrawer__labelInline}>
          <Translate
            pt="Rodada:"
            en="Round:"
          />
        </div>
        <Avatar
          className={styles.gameInfoDrawer__round}
          size="small"
        >
          {round.current}
        </Avatar>
        <span className={styles.gameInfoDrawer__inlineSeparator}>
          <Translate
            pt="de"
            en="out of"
          />
        </span>
        <Avatar
          className={styles.gameInfoDrawer__round}
          size="small"
        >
          {round.total}
        </Avatar>
      </li>

      {Boolean(groupScore) && (
        <li>
          <div className={styles.gameInfoDrawer__labelInline}>
            <Translate
              pt="Pontos:"
              en="Points:"
            />
          </div>
          <Avatar
            className={styles.gameInfoDrawer__round}
            size="default"
            style={{ backgroundColor: 'gold', color: 'black' }}
          >
            {groupScore}
          </Avatar>
        </li>
      )}
    </ul>
  );
}
