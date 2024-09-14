import { random } from 'lodash';
import { useState } from 'react';
// Ant Design Resources
import { Button, Space } from 'antd';
// Types
import { GamePlayer } from 'types/player';
// Icons
import { EarthIcon } from 'icons/EarthIcon';
// Components
import { AvatarName, IconAvatar } from 'components/avatars';
import { Translate } from 'components/language';
import { MouseFollowingContent } from 'components/mouse/MouseFollowingContent';
import { Instruction, Title } from 'components/text';
// Internal
import { DecisionButtons } from './DecisionButtons';
import { TestStepProps } from '../TestArea';

export function MouseFollowingContentTest({ onResult, step }: TestStepProps) {
  const [contentType, setContentType] = useState<'div' | 'avatar' | 'icon'>('div');
  const player: GamePlayer = {
    id: '1',
    name: 'Player 1',
    avatarId: String(random(0, 50)),
    updatedAt: Date.now(),
    ready: true,
  };

  const onContentChange = () => {
    setContentType((prev) => {
      switch (prev) {
        case 'div':
          return 'avatar';
        case 'avatar':
          return 'icon';
        default:
          return 'div';
      }
    });
  };
  return (
    <Space className="space-container full-width" direction="vertical">
      <Title level={2} size="small">
        <Translate pt="Seguidor do mouse" en="Mouse Follower" />
      </Title>

      <Instruction contained>
        <Translate pt="Mova o mouse ou dedo pela tela" en="Move the mouse or finger across the screen" />
      </Instruction>

      <Space wrap direction="vertical" className="space-container full-width" style={{ height: 150 }}>
        <MouseFollowingContent active={contentType === 'div'}>
          <div
            style={{
              width: '75px',
              height: '75px',
              backgroundColor: 'black',
              color: 'white',
              display: 'grid',
              placeItems: 'center',
              fontSize: '3rem',
            }}
          >
            B
          </div>
        </MouseFollowingContent>
        <MouseFollowingContent active={contentType === 'avatar'}>
          <AvatarName player={player} />
        </MouseFollowingContent>
        <MouseFollowingContent active={contentType === 'icon'}>
          <IconAvatar icon={<EarthIcon />} size="large" />
        </MouseFollowingContent>

        {contentType === 'div' && (
          <Button onClick={onContentChange} type="primary" size="large">
            <Translate
              pt="Se um quadrado preto com a letra B está seguindo seu cursor, aperte o botão"
              en="If a black square with the letter B is following your cursor, press the button"
            />
          </Button>
        )}
        {contentType === 'avatar' && (
          <Button onClick={onContentChange} type="primary" size="large">
            <Translate
              pt="Se um avatar está seguindo seu cursor, aperte o botão"
              en="If an avatar is following your cursor, press the button"
            />
          </Button>
        )}
        {contentType === 'icon' && (
          <p>
            <Translate
              pt="Se um ícone da Terra está seguindo seu cursor, aperte o Sim para continuar"
              en="If an Earth icon is following your cursor, press Yes to continue"
            />
          </p>
        )}
      </Space>

      <DecisionButtons
        step={step}
        onClick={onResult}
        prompt={{
          pt: 'Siga as instruções acima, se a qualquer momento não der certo, aperte o não vermelho',
          en: "Follow the instructions above, if at any point it doesn't work, press the red no",
        }}
      />
    </Space>
  );
}
