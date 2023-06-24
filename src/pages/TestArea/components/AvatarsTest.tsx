import { random } from 'lodash';
// Ant Design Resources
import { Space } from 'antd';
// Components
import { Translate } from 'components/language';
import { Instruction, Title } from 'components/text';
import { DecisionButtons } from './DecisionButtons';
import { TestStepProps } from '../TestArea';
import { AvatarCard, AvatarName, AvatarStrip } from 'components/avatars';
import { SuperHeroAvatar } from 'components/avatars/SuperHeroAvatar';
import { CostumeAvatar } from 'games/na-rua-do-medo/components/CostumeAvatar';
import { ClubberAvatar } from 'games/megamix/components/ClubberAvatar';
import { SheepAvatar } from 'games/mente-coletiva/components/SheepAvatar';

const superHeroId = String(random(0, 20));

export function AvatarsTest({ onResult, step }: TestStepProps) {
  const player: GamePlayer = {
    id: '1',
    name: 'Player 1',
    avatarId: random(0, 50),
    updatedAt: Date.now(),
    read: true,
  };

  return (
    <Space className="space-container full-width" direction="vertical">
      <Title level={2} size="small">
        <Translate pt="Avatares" en="Avatars" />
      </Title>

      <Instruction contained>
        <Translate
          pt="Alguns jogos usarão avatares customizados"
          en="Many games have timers in different types:"
        />
      </Instruction>

      <Space wrap className="space-container full-width" direction="vertical">
        <AvatarCard player={player} />
        <AvatarStrip player={player} />
        <AvatarName player={player} />
      </Space>

      <Space wrap className="space-container full-width">
        <SuperHeroAvatar id={player.avatarId} size="large" superHeroId={superHeroId} />
        <CostumeAvatar id={player.avatarId} size="large" costumeId={superHeroId} />
        <ClubberAvatar id={player.avatarId} size="large" clubberId={superHeroId} />
        <SheepAvatar id={player.avatarId} size="large" sheepId={superHeroId} animate />
      </Space>

      <DecisionButtons
        step={step}
        onClick={onResult}
        prompt={{
          pt: 'Você consegue ver os 7 avatars (contando os sem figurinha, só o ícone)?',
          en: 'Are you able to see all 7 avatars (counting the square ones only with the icon)?',
        }}
      />
    </Space>
  );
}
