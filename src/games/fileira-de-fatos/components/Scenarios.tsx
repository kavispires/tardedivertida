import clsx from 'clsx';
// Ant Design Resources
import { Avatar, Space } from 'antd';
// Types
import type { GamePlayer } from 'types/player';
import type { TextCard } from 'types/tdr';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Components
import { PlayerAvatarStrip } from 'components/avatars';
import { EmojiCard } from 'components/cards/EmojiCard';
import { DualTranslate } from 'components/language';
// Internal
import type { ScaleEntry } from '../utils/types';

type ScenarioCardProps = {
  scenarios: (TextCard | null)[];
  reference: ScaleEntry[];
  player?: GamePlayer;
};

export function Scenarios({ scenarios, reference, player }: ScenarioCardProps) {
  const width = useCardWidth(8, {
    gap: 16,
    minWidth: 100,
    maxWidth: 200,
    margin: 32,
  });

  return (
    <Space className={clsx(player ? 'scenarios-results' : 'scenarios')}>
      {!!player && <PlayerAvatarStrip player={player} />}
      {scenarios.map((entry, index) => (
        <div
          key={`position-${index}`}
          className="scenario"
          style={{ width: `${width}px` }}
        >
          <Avatar>{index + 1}</Avatar>
          <div className="scenario__tagline">
            <DualTranslate>{reference[index].text}</DualTranslate>
          </div>
          <EmojiCard
            emojiId={reference[index].id}
            className="scenario__emoji"
          />
          {entry && <div className="scenario__card">{entry.text}</div>}
        </div>
      ))}
      {!!player && <PlayerAvatarStrip player={player} />}
    </Space>
  );
}
