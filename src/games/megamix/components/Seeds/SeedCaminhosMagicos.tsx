import { capitalize } from 'lodash';
// AntDesign Resources
import { Button, Space } from 'antd';
import { HeartOutlined, MessageOutlined, SendOutlined } from '@ant-design/icons';
// Components
import { BikiniModelIcon } from 'icons/BikiniModelIcon';
import { Translate } from 'components/language';
import { Instruction, TextHighlight, Title } from 'components/text';
import { SocialProfile } from '../SocialProfile';

type SeedCaminhosMagicosProps = {
  seed: SeedEntryCaminhosMagicos;
  updateData: GenericComponent;
  user: GamePlayer;
};

export function SeedCaminhosMagicos({ seed, updateData, user }: SeedCaminhosMagicosProps) {
  return (
    <div className="seed-container">
      <Title size="xx-small">
        <Translate
          pt="Você decidiu postar uma foto piranhuda no Instagram antes de se arrumar..."
          en="You decided to post a thirst trap on Instagram before getting ready..."
        />
      </Title>

      <Space direction="vertical">
        <Instruction className="seed-instruction">
          <Translate
            pt={
              <>
                Para não pensarem mal de você, você escolheu <TextHighlight>{seed.portal.text}</TextHighlight>{' '}
                como a legenda de impacto da sua postagem. Agora escolha o melhor adjetivo que vai bem com
                ela.
              </>
            }
            en={
              <>
                Thinking about the haters, you chose <TextHighlight>{seed.portal.text}</TextHighlight> as a
                caption. Now select the best adjective to go with it.
              </>
            }
          />
        </Instruction>

        <div className="cm-instagram">
          <SocialProfile
            avatarId={user.avatarId}
            name={user.name}
            handle={<Translate pt="Logo ali, Brasil" en="Somewhere" />}
            className="cm-instagram__user"
          />
          <div className="cm-instagram__picture">
            <BikiniModelIcon />
          </div>
          <div className="cm-instagram__buttons">
            <HeartOutlined /> <MessageOutlined /> <SendOutlined />
          </div>
          <div className="cm-instagram__post">
            <strong>{user.name.toLowerCase()}</strong> {capitalize(seed.portal.text)}...
          </div>
        </div>

        <Space>
          {seed.cards.map((card) => (
            <Button
              key={card.id}
              onClick={() => updateData({ [seed.portal.id]: card.id }, true)}
              type="primary"
            >
              {card.text}
            </Button>
          ))}
        </Space>
      </Space>
    </div>
  );
}
