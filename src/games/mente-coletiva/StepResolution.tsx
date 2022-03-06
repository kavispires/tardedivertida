import { useEffect, useMemo, useState } from 'react';
import { useTimer } from 'react-timer-hook';
// Ant Design Resources
import { HeartFilled } from '@ant-design/icons';
// Hooks
import { getAnimationClass, inNSeconds } from 'utils/helpers';
// Components
import {
  AdminNextRoundButton,
  Instruction,
  RankingBoard,
  Step,
  StepSwitcher,
  Title,
  Translate,
} from 'components';
import { Pasture } from './Pasture';
import { RoundType } from './RoundType';
import clsx from 'clsx';

type StepResolutionProps = {
  ranking: GameRanking;
  players: GamePlayers;
  roundType: number;
  pastureChangeStr: string;
  round: GameRound;
  announceSave: boolean;
  pastureSize: number;
};

export function StepResolution({
  ranking,
  players,
  roundType,
  pastureChangeStr,
  round,
  pastureSize,
  announceSave = false,
}: StepResolutionProps) {
  const [step, setStep] = useState(0);
  const [pastureIndex, setPastureIndex] = useState(0);
  const [showAnnounceSave, setShowAnnounceSave] = useState(false);

  const pastureChange = useMemo(() => JSON.parse(pastureChangeStr), [pastureChangeStr]);

  const { seconds } = useTimer({
    expiryTimestamp: inNSeconds(15),
    autoStart: true,
  });

  useEffect(() => {
    if (seconds === 7) {
      setStep(1);
    }
    if (seconds === 5) {
      setPastureIndex(1);
    }
    if (seconds === 4 && announceSave) {
      setShowAnnounceSave(true);
    }

    if (seconds === 1) {
      setPastureIndex(2);
    }
  }, [seconds]); // eslint-disable-line

  return (
    <Step fullWidth>
      <Title level={1}>
        <Translate pt="Resultado" en="Results" />
      </Title>

      {step === 0 && <RoundType roundType={roundType} />}

      <StepSwitcher step={step}>
        <Step key={0}>
          <RankingBoard ranking={ranking} players={players} />
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
          <AdminNextRoundButton round={round} />
        </Step>
      </StepSwitcher>
    </Step>
  );
}
