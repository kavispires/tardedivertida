// Ant Design Resources
import { TrophyOutlined } from '@ant-design/icons';
// Types
import type { TextCard } from 'types/tdr';
// Hooks
import type { UseStep } from 'hooks/useStep';
import { useTemporarilyHidePlayersBar } from 'hooks/useTemporarilyHidePlayersBar';
// Components
import { TimedButton } from 'components/buttons';
import { CharacterCard } from 'components/cards/CharacterCard';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { Step, type StepProps } from 'components/steps';
import { StepTitle } from 'components/text';
// Internal
import type { Bet, Bracket } from './utils/type';
import { BetsFloatingHand } from './components/BetsFloatingHand';
import { Challenge } from './components/Challenge';
// Ant Design resources

type StepWinnerProps = {
  challenge: TextCard;
  brackets: Bracket[];
  bets: Bet;
  goToNextStep: UseStep['goToNextStep'];
  selectedContenderId: CardId;
} & Pick<StepProps, 'announcement'>;

export function StepWinner({
  challenge,
  brackets,
  bets,
  goToNextStep,
  selectedContenderId,
  announcement,
}: StepWinnerProps) {
  useTemporarilyHidePlayersBar();

  return (
    <Step fullWidth announcement={announcement}>
      <StepTitle>
        <Translate pt="Vencedor" en="Winner" />
      </StepTitle>

      <Challenge challenge={challenge} />

      <SpaceContainer className="margin">
        <CharacterCard size={200} overlayColor="yellow" character={brackets[brackets.length - 1]} />
      </SpaceContainer>

      <SpaceContainer>
        <TimedButton duration={7} icon={<TrophyOutlined />} onExpire={goToNextStep} onClick={goToNextStep}>
          <Translate pt="Ver Ranking" en="See Ranking" />
        </TimedButton>
      </SpaceContainer>

      <BetsFloatingHand bets={bets} brackets={brackets} selectedContenderId={selectedContenderId} />
    </Step>
  );
}
