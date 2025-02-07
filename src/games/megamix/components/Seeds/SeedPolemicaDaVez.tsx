// Components
import { Tweet } from 'components/game/SocialProfile';
import { Translate } from 'components/language';
import { Title } from 'components/text';
// Internal
import type { SeedEntryPolemicaDaVez } from '../../utils/types';

type SeedPolemicaDaVezProps = {
  seed: SeedEntryPolemicaDaVez;
  updateData: GenericComponent;
};

export function SeedPolemicaDaVez({ seed, updateData }: SeedPolemicaDaVezProps) {
  return (
    <div className="seed-container">
      <Title size="xx-small" colorScheme="light">
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
              You open twitter and see this tweet. Like or Dislike?
            </>
          }
        />
      </Title>

      <Tweet
        avatarId="A"
        name="Bob"
        handle="@imnotarobot"
        verified
        onLike={() => updateData({ likeTweet: true }, true)}
        onDislike={() => updateData({ likeTweet: false }, true)}
      >
        {seed.card.text}
      </Tweet>
    </div>
  );
}
