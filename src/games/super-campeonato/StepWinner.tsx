// Ant Design Resources
import { TrophyOutlined } from '@ant-design/icons';
// Types
import type { TextCard } from 'types/tdr';
// Hooks
import type { UseStep } from 'hooks/useStep';
// Components
import { TimedButton } from 'components/buttons/TimedButton';
import { CharacterCard } from 'components/cards/CharacterCard';
import { Translate } from 'components/language/Translate';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { Step, type StepProps } from 'components/steps/Step';
import { StepTitle } from 'components/text/StepTitle';
// Internal
import type { Bet, Bracket } from './utils/type';
import { BetsFloatingHand } from './components/BetsFloatingHand';
import { Challenge } from './components/Challenge';

type StepWinnerProps = {
  challenge: TextCard;
  brackets: Bracket[];
  bets: Bet;
  goToNextStep: UseStep['goToNextStep'];
  selectedContenderIds: UID[];
} & Pick<StepProps, 'announcement'>;

export function StepWinner({
  challenge,
  brackets,
  bets,
  goToNextStep,
  selectedContenderIds,
  announcement,
}: StepWinnerProps) {
  return (
    <Step
      fullWidth
      announcement={announcement}
      hidePlayersBar
    >
      <StepTitle>
        <Translate
          pt="Vencedor"
          en="Winner"
        />
      </StepTitle>

      <Challenge challenge={challenge} />

      <SpaceContainer className="margin">
        <CharacterCard
          size={200}
          overlayColor="yellow"
          character={brackets[brackets.length - 1]}
        />
      </SpaceContainer>

      <SpaceContainer>
        <TimedButton
          duration={7}
          icon={<TrophyOutlined />}
          onExpire={goToNextStep}
          onClick={goToNextStep}
        >
          <Translate
            pt="Ver Ranking"
            en="See Ranking"
          />
        </TimedButton>
      </SpaceContainer>

      <BetsFloatingHand
        bets={bets}
        brackets={brackets}
        selectedContenderIds={selectedContenderIds}
      />
    </Step>
  );
}
