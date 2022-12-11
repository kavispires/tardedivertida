import clsx from 'clsx';
import { useEffect, useMemo, useState } from 'react';
// Ant Design Resources
import { HeartFilled } from '@ant-design/icons';
// Hooks
import { useCountdown } from 'hooks/useCountdown';
import { useTemporarilyHidePlayersBar } from 'hooks/useTemporarilyHidePlayersBar';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Components
import { Pasture } from './components/Pasture';
import { RoundType } from './components/RoundType';
import { Step, StepSwitcher } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { RankingBoard } from 'components/ranking';
import { AdminNextPhaseButton } from 'components/admin';

type StepResolutionProps = {
  ranking: GameRanking;
  players: GamePlayers;
  roundType: number;
  pastureChangeStr: string;
  round: GameRound;
  announceSave: boolean;
  pastureSize: number;
} & AnnouncementProps;

export function StepResolution({
  announcement,
  ranking,
  players,
  roundType,
  pastureChangeStr,
  round,
  pastureSize,
  announceSave = false,
}: StepResolutionProps) {
  useTemporarilyHidePlayersBar();
  const [step, setStep] = useState(0);
  const [pastureIndex, setPastureIndex] = useState(0);
  const [showAnnounceSave, setShowAnnounceSave] = useState(false);

  const pastureChange = useMemo(() => JSON.parse(pastureChangeStr), [pastureChangeStr]);
  const { timeLeft } = useCountdown({
    duration: 15,
    autoStart: true,
  });

  useEffect(() => {
    if (timeLeft === 7) {
      setStep(1);
    }
    if (timeLeft === 5) {
      setPastureIndex(1);
    }
    if (timeLeft === 4 && announceSave) {
      setShowAnnounceSave(true);
    }

    if (timeLeft === 1) {
      setPastureIndex(2);
    }
  }, [timeLeft]); // eslint-disable-line

  return (
    <Step fullWidth announcement={announcement}>
      <Title level={1}>
        <Translate pt="Resultado" en="Results" />
      </Title>

      {step === 0 && <RoundType roundType={roundType} />}

      <StepSwitcher step={step} players={players}>
        <Step key={0}>
          <RankingBoard ranking={ranking} players={players} hideGainedPoints delay={5} />
        </Step>

        <Step key={1}>
          {showAnnounceSave && (
            <Instruction contained className={clsx('m-save-card', getAnimationClass('zoomInDown'))}>
              <HeartFilled style={{ color: 'red' }} />{' '}
              <Translate
                pt="Vamos dar uma última chance para a pobre ovelhinha que
              ia morrer agora"
                en="Let's give one more chance to the poor sheep about to die. The last one!"
              />{' '}
              <HeartFilled style={{ color: 'red' }} />
            </Instruction>
          )}
          <Pasture
            players={pastureChange[pastureIndex]}
            pastureSize={pastureSize}
            roundType={step > 0 ? roundType : undefined}
          />
          <AdminNextPhaseButton round={round} />
        </Step>
      </StepSwitcher>
    </Step>
  );
}
