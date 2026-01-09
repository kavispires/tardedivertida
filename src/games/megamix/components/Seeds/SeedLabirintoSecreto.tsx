import { capitalize } from 'lodash';
// Ant Design Resources
import { HeartOutlined, MessageOutlined, SendOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
// Types
import type { GamePlayer } from 'types/player';
// Icons
import { BikiniModelIcon } from 'icons/BikiniModelIcon';
// Components
import { SocialProfile } from 'components/game/SocialProfile';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { Instruction, TextHighlight, Title } from 'components/text';
// Internal
import type { SeedEntryLabirintoSecreto } from '../../utils/types';

type SeedLabirintoSecretoProps = {
  seed: SeedEntryLabirintoSecreto;
  updateData: GenericComponent;
  user: GamePlayer;
};

export function SeedLabirintoSecreto({ seed, updateData, user }: SeedLabirintoSecretoProps) {
  return (
    <div className="seed-container">
      <Title
        size="xx-small"
        colorScheme="light"
      >
        <Translate
          pt="Você decidiu postar uma foto piranhuda no Instagram antes de se arrumar..."
          en="You decided to post a thirst trap on Instagram before getting ready..."
        />
      </Title>

      <Space orientation="vertical">
        <Instruction className="seed-instruction">
          <Translate
            pt={
              <>
                Para não pensarem mal de você, você escolheu <TextHighlight>{seed.tree.text}</TextHighlight>{' '}
                como a legenda de impacto da sua postagem. Agora escolha o melhor adjetivo que vai bem com
                ela.
              </>
            }
            en={
              <>
                Thinking about the haters, you chose <TextHighlight>{seed.tree.text}</TextHighlight> as a
                caption. Now select the best adjective to go with it.
              </>
            }
          />
        </Instruction>

        <div className="cm-instagram">
          <SocialProfile
            avatarId={user.avatarId}
            name={user.name}
            handle={
              <Translate
                pt="Logo ali, Brasil"
                en="Somewhere"
              />
            }
            className="cm-instagram__user"
          />
          <div className="cm-instagram__picture">
            <BikiniModelIcon />
          </div>
          <div className="cm-instagram__buttons">
            <HeartOutlined /> <MessageOutlined /> <SendOutlined />
          </div>
          <div className="cm-instagram__post">
            <strong>{user.name.toLowerCase()}</strong> {capitalize(seed.tree.text)}...
          </div>
        </div>

        <SpaceContainer wrap>
          {seed.cards.map((card) => (
            <Button
              key={card.id}
              onClick={() => updateData({ [seed.tree.id]: card.id }, true)}
              type="primary"
            >
              {card.text}
            </Button>
          ))}
        </SpaceContainer>
      </Space>
    </div>
  );
}
