import clsx from 'clsx';
import { useEffect, useMemo, useState } from 'react';
// Ant Design Resources
import { HeartFilled } from '@ant-design/icons';
// Types
import type { GameRanking, GameRound, GamePlayers } from 'types/game';
// Hooks
import { useCountdown } from 'hooks/useCountdown';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Components
import { HostNextPhaseButton } from 'components/host';
import { Translate } from 'components/language';
import { RankingBoard } from 'components/ranking';
import { Step, type StepProps, StepSwitcher } from 'components/steps';
import { Instruction, StepTitle } from 'components/text';
// Internal
import { Pasture } from './components/Pasture';
import { RoundType } from './components/RoundType';

type StepResolutionProps = {
  ranking: GameRanking;
  players: GamePlayers;
  roundType: number;
  pastureChangeStr: string;
  round: GameRound;
  announceSave: boolean;
  pastureSize: number;
} & Pick<StepProps, 'announcement'>;

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
  const [step, setStep] = useState(0);
  const [pastureIndex, setPastureIndex] = useState(0);
  const [showAnnounceSave, setShowAnnounceSave] = useState(false);

  const pastureChange = useMemo(() => JSON.parse(pastureChangeStr), [pastureChangeStr]);
  const { timeLeft } = useCountdown({
    duration: 17,
    autoStart: true,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: only timeLeft changes
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
  }, [timeLeft]);

  return (
    <Step
      fullWidth
      announcement={announcement}
      hidePlayersBar
    >
      <StepTitle>
        <Translate
          pt="Resultado"
          en="Results"
        />
      </StepTitle>

      {step === 0 && <RoundType roundType={roundType} />}

      <StepSwitcher
        step={step}
        players={players}
      >
        <Step key={0}>
          <RankingBoard
            ranking={ranking}
            players={players}
            hideGainedPoints
            delay={1}
          />
        </Step>

        <Step key={1}>
          {showAnnounceSave && (
            <Instruction
              contained
              className={clsx('m-save-card', getAnimationClass('zoomInDown'))}
            >
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
          <HostNextPhaseButton round={round} />
        </Step>
      </StepSwitcher>
    </Step>
  );
}
