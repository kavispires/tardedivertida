// Components
import { Translate } from 'components/language';
import { Title } from 'components/text';
import { Tweet } from 'components/game/SocialProfile';

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

      <Tweet
        avatarId="A"
        name="Bob"
        handle="@imnotarobot"
        verified
        onLike={() => updateData({ likeTopic: true }, true)}
        onDislike={() => updateData({ likeTopic: false }, true)}
      >
        {seed.card.text}
      </Tweet>
    </div>
  );
}
