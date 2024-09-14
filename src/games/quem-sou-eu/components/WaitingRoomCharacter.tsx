// Ant Design Resources
import { Space } from 'antd';
// Types
import type { GamePlayer } from 'types/player';
// Components
import { CharacterCard } from 'components/cards/CharacterCard';
// Internal
import { PlayerGlyphs } from './PlayerGlyphs';

type WaitingRoomCharacterProps = {
  user: GamePlayer;
};

export function WaitingRoomCharacter({ user }: WaitingRoomCharacterProps) {
  if (!user.selectedGlyphs) {
    return <></>;
  }

  return (
    <Space wrap>
      <CharacterCard size={100} character={user.character} />
      <PlayerGlyphs player={user} glyphWidth={60} />
    </Space>
  );
}
