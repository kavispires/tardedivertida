// Ant Design Resources
import { Divider, Flex } from 'antd';
// Types
import type { GamePlayers, GamePlayer } from 'types/game';
// Hooks
import { useCardWidth } from '@hooks/useCardWidth';
// Components
import { TimedButton } from '@components/buttons/TimedButton';
import { BookPatternCard } from '@components/cards/BookPatternCard';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { PointsHighlight } from '@components/metrics/PointsHighlight';
import { ListOfPlayers } from '@components/players/ListOfPlayers';
import { Step, type StepProps } from '@components/steps/Step';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { StepTitle } from '@components/text/StepTitle';
import { TextHighlight } from '@components/text/TextHighlight';
// Internal
import type { GalleryEntry } from './utils/types';

type StepResultsProps = {
  players: GamePlayers;
  user: GamePlayer;
  sequence: string[];
  gallery: GalleryEntry;
  goToNextStep: () => void;
} & Pick<StepProps, 'announcement'>;

export function StepResults({ announcement, sequence, players, gallery, goToNextStep }: StepResultsProps) {
  const cardWidth = useCardWidth(5, { maxWidth: 128 });

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle>
        <Translate
          pt="E ai, quem escolheu os mesmo atributos que você?"
          en="So, who chose the same attributes as you?"
        />
      </StepTitle>

      <SpaceContainer>
        {sequence.map((patternId, index) => (
          <BookPatternCard
            patternId={patternId}
            key={index}
            cardWidth={cardWidth}
          />
        ))}
      </SpaceContainer>

      <RuleInstruction type="action">
        <Translate
          pt="Se você deu match com qualquer jogador na <highlight>cor</highlight> você ganha {points}, para o <highlight>gênero</highlight> você também ganha {points}, e a <highlight>letra</highlight> também vale {points}. Se você conseguiu dar match com a carta inteira, você ganha {bonus}"
          en="If you matched with any player on the <highlight>color</highlight> you earn {points}, for the <highlight>genre</highlight> you also earn {points}, and the <highlight>letter</highlight> is also worth {points}. If you managed to match the entire card, you earn {bonus}."
          values={{
            highlight: (text) => <TextHighlight>{text}</TextHighlight>,
            points: <PointsHighlight value={1} />,
            bonus: (
              <PointsHighlight
                value={1}
                type="positive"
                bonus
              />
            ),
          }}
        />
      </RuleInstruction>

      <SpaceContainer>
        {gallery.cards.map((card, index) => (
          <Flex
            vertical
            align="center"
            key={index}
            gap={8}
          >
            <BookPatternCard
              patternId={card.patternId}
              key={index}
              cardWidth={cardWidth}
            />
            <ListOfPlayers
              players={players}
              list={card.playersIds}
              prefix={card.patternId}
              style={{ maxWidth: cardWidth * 1.5 }}
            />

            <span
              style={{ visibility: card.playersIds.length <= 1 ? 'hidden' : 'visible' }}
              aria-hidden={card.playersIds.length <= 1}
            >
              <PointsHighlight
                type="positive"
                bonus
                value={1}
              />
            </span>
          </Flex>
        ))}
      </SpaceContainer>

      <Divider />

      <TimedButton
        onClick={goToNextStep}
        onExpire={goToNextStep}
        duration={30}
      >
        <Translate
          pt="Continuar"
          en="Continue"
        />
      </TimedButton>
    </Step>
  );
}
