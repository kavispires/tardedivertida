import { SheepAvatar } from 'games/mente-coletiva/components/SheepAvatar';
import { random } from 'lodash';
// Types
import type { GamePlayer } from 'types/player';
// Components
import { PlayerAvatarCard, PlayerAvatarName, PlayerAvatarStrip } from 'components/avatars';
import { ClubberAvatar } from 'components/avatars/ClubberAvatar';
import { CostumeAvatar } from 'components/avatars/CostumeAvatar';
import { SuperHeroAvatar } from 'components/avatars/SuperHeroAvatar';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { Instruction, Title } from 'components/text';
// Internal
import { DecisionButtons } from './DecisionButtons';
import type { TestStepProps } from '../TestArea';

const superHeroId = String(random(0, 20));

export function AvatarsTest({ onResult, step }: TestStepProps) {
  const player: GamePlayer = {
    id: '1',
    name: 'Player 1',
    avatarId: String(random(0, 50)),
    updatedAt: Date.now(),
    ready: true,
  };

  return (
    <SpaceContainer className="full-width" vertical>
      <Title level={2} size="small">
        <Translate pt="Avatares" en="Avatars" />
      </Title>

      <Instruction contained>
        <Translate
          pt="Alguns jogos usarão avatares customizados"
          en="Many games have timers in different types:"
        />
      </Instruction>

      <SpaceContainer wrap className="full-width" vertical>
        <PlayerAvatarCard player={player} />
        <PlayerAvatarStrip player={player} />
        <PlayerAvatarName player={player} />
      </SpaceContainer>

      <SpaceContainer wrap className="full-width" vertical>
        <SuperHeroAvatar avatarId={player.avatarId} id={superHeroId} />
        <CostumeAvatar avatarId={player.avatarId} id={superHeroId} />
        <ClubberAvatar avatarId={player.avatarId} id={superHeroId} />
        <SheepAvatar id={player.avatarId} sheepId={superHeroId} animate />
      </SpaceContainer>

      <DecisionButtons
        step={step}
        onClick={onResult}
        prompt={{
          pt: 'Você consegue ver os 7 avatars (contando os sem figurinha, só o ícone)?',
          en: 'Are you able to see all 7 avatars (counting the square ones only with the icon)?',
        }}
      />
    </SpaceContainer>
  );
}
