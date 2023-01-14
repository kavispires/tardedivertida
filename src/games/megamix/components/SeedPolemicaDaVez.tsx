// AntDesign Resources
import { Button } from 'antd';
import { DislikeFilled, LikeFilled } from '@ant-design/icons';
// Components
import { Translate } from 'components/language';
import { Title } from 'components/text';
import { SocialProfile } from './SocialProfile';

type SeedPolemicaDaVezProps = {
  seed: SeedEntryPolemicaDaVez;
  updateData: GenericComponent;
};

export function SeedPolemicaDaVez({ seed, updateData }: SeedPolemicaDaVezProps) {
  return (
    <div className="seed-container">
      <Title size="xx-small">
        <Translate
          pt={
            <>
              Vamos procrastinar:
              <br />
              Você abre o Twitter e vê esse tópico. Curte ou não curte?
            </>
          }
          en={
            <>
              Let's procrastinate:
              <br />
              You open twitter and see this topic. Like or Dislike?
            </>
          }
        />
      </Title>

      <div className="tweet">
        <SocialProfile avatarId="A" name="Bob" handle="@bob" verified />
        <span className="tweet__text">{seed.card.text}</span>
        <div className="tweet__buttons">
          <Button block icon={<LikeFilled />} onClick={() => updateData({ likeTopic: true }, true)}>
            <Translate pt="Curtir" en="Like" />
          </Button>
          <Button block icon={<DislikeFilled />} onClick={() => updateData({ likeTopic: false }, true)}>
            <Translate pt="Não curto" en="Dislike" />
          </Button>
        </div>
      </div>
    </div>
  );
}
