// Ant Design resources
import { Space } from 'antd';
import { TrophyOutlined } from '@ant-design/icons';
// Hooks
import { useTemporarilyHidePlayersBar } from 'hooks/useTemporarilyHidePlayersBar';
// Components
import { TimedButton } from 'components/buttons';
import { Translate } from 'components/language';
import { Step } from 'components/steps';
import { Title } from 'components/text';
import { BetsFloatingHand } from './components/BetsFloatingHand';
import { Challenge } from './components/Challenge';
import { ContenderCard } from './components/ContenderCard';

type StepWinnerProps = {
  challenge: TextCard;
  brackets: WBracket[];
  bets: WBets;
  goToNextStep: GenericFunction;
  selectedContenderId: CardId;
};

export function StepWinner({
  challenge,
  brackets,
  bets,
  goToNextStep,
  selectedContenderId,
}: StepWinnerProps) {
  useTemporarilyHidePlayersBar();

  return (
    <Step fullWidth>
      <Title size="medium">
        <Translate pt="Vencedor" en="Winner" />
      </Title>

      <Challenge challenge={challenge} />

      <Space className="space-container margin" align="center">
        <ContenderCard size={200} overlayColor="yellow" contender={brackets[brackets.length - 1]} />
      </Space>

      <Space className="space-container " align="center">
        <TimedButton duration={4} icon={<TrophyOutlined />} onExpire={goToNextStep} onClick={goToNextStep}>
          <Translate pt="Ver Ranking" en="See Ranking" />
        </TimedButton>
      </Space>

      <BetsFloatingHand bets={bets} brackets={brackets} selectedContenderId={selectedContenderId} />
    </Step>
  );
}
