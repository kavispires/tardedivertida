// Ant Design Resources
import { Avatar, Space } from 'antd';
// Types
import type { GamePlayer } from 'types/player';
import type { TextCard } from 'types/tdr';
import type { ScaleEntry } from '../utils/types';
// Hook
import { useCardWidth } from 'hooks/useCardWidth';
// Components
import { EmojiCard } from 'components/cards/EmojiCard';
import { DualTranslate } from 'components/language';
import { AvatarStrip } from 'components/avatars';

type ScenarioCardProps = {
  player: GamePlayer;
  scenarios: (TextCard | null)[];
  reference: ScaleEntry[];
};

export function FinalScenarios({ scenarios, reference, player }: ScenarioCardProps) {
  const width = useCardWidth(8, {
    gap: 16,
    minWidth: 100,
    maxWidth: 200,
    margin: 32,
  });

  return (
    <Space className="final-scenarios">
      <AvatarStrip player={player} withName />
      {scenarios.map((entry, index) => (
        <div
          key={`${player.id}-position-${index}-${(entry ?? {}).id}`}
          className="scenario"
          style={{ width: `${width}px` }}
        >
          <Avatar>{index + 1}</Avatar>
          <div className="scenario__tagline">
            <DualTranslate>{reference[index].text}</DualTranslate>
          </div>
          <EmojiCard id={reference[index].id} className="scenario__emoji" />
          {entry && <div className="scenario__card">{entry.text}</div>}
        </div>
      ))}
    </Space>
  );
}
