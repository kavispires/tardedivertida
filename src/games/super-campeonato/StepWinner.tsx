// Ant Design resources
import { Space } from 'antd';
import { TrophyOutlined } from '@ant-design/icons';
// Types
import type { TextCard } from 'types/tdr';
import type { Bet, Bracket } from './utils/type';
import type { UseStep } from 'hooks/useStep';
// Hooks
import { useTemporarilyHidePlayersBar } from 'hooks/useTemporarilyHidePlayersBar';
// Components
import { TimedButton } from 'components/buttons';
import { Translate } from 'components/language';
import { Step, type StepProps } from 'components/steps';
import { Title } from 'components/text';
import { BetsFloatingHand } from './components/BetsFloatingHand';
import { Challenge } from './components/Challenge';
import { CharacterCard } from 'components/cards/CharacterCard';

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
      <Title size="medium">
        <Translate pt="Vencedor" en="Winner" />
      </Title>

      <Challenge challenge={challenge} />

      <Space className="space-container margin" align="center">
        <CharacterCard size={200} overlayColor="yellow" character={brackets[brackets.length - 1]} />
      </Space>

      <Space className="space-container " align="center">
        <TimedButton duration={7} icon={<TrophyOutlined />} onExpire={goToNextStep} onClick={goToNextStep}>
          <Translate pt="Ver Ranking" en="See Ranking" />
        </TimedButton>
      </Space>

      <BetsFloatingHand bets={bets} brackets={brackets} selectedContenderId={selectedContenderId} />
    </Step>
  );
}
