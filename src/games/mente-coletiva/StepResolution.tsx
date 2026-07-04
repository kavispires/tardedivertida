import { motion } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';
// Ant Design Resources
import { HeartFilled } from '@ant-design/icons';
// Types
import type { GameRanking, GameRound, GamePlayers } from 'types/game';
// Hooks
import { useCountdown } from '@hooks/useCountdown';
// Components
import { HostNextPhaseButton } from '@components/host/HostNextPhaseButton';
import { Translate } from '@components/language/Translate';
import { Step, type StepProps } from '@components/steps/Step';
import { StepSwitcher } from '@components/steps/StepSwitcher';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { StepTitle } from '@components/text/StepTitle';
import { RankingBoard } from '@components/wrappers/RankingBoard';
// Internal
import { Pasture } from './components/Pasture';
import { RoundType } from './components/RoundType';
import { TextHighlight } from '@components/text/TextHighlight';

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
          <motion.div
            animate={{
              opacity: showAnnounceSave ? 1 : 0,
              scale: showAnnounceSave ? 1 : 0.5,
              y: showAnnounceSave ? 0 : -50,
            }}
            transition={{
              duration: 0.5,
              ease: 'backOut',
              scale: { type: 'spring', stiffness: 200, damping: 15 },
            }}
          >
            <RuleInstruction
              type="alert"
              className="m-save-card"
            >
              <HeartFilled style={{ color: 'red' }} />{' '}
              <Translate
                pt="Vamos dar uma última chance para a pobre ovelhinha que
                ia morrer agora"
                en="Let's give one more chance to the poor sheep about to die. The last one!"
              />{' '}
              <HeartFilled style={{ color: 'red' }} />
            </RuleInstruction>
          </motion.div>

          <Pasture
            players={pastureChange[pastureIndex]}
            pastureSize={pastureSize}
            roundType={step > 0 ? roundType : undefined}
          />

          <RuleInstruction
            type="event"
            style={{ marginTop: 100, zIndex: 10 }}
          >
            <Translate
              en={
                <>
                  Points reset to <TextHighlight>0</TextHighlight> every round, so don't worry if you didn't
                  do well this time!
                </>
              }
              pt={
                <>
                  Os pontos resetam para <TextHighlight>0</TextHighlight> toda rodada, então não se preocupe
                  se você não foi bem dessa vez!
                </>
              }
            />
          </RuleInstruction>

          <HostNextPhaseButton
            round={round}
            withWaitingTimeBar
          />
        </Step>
      </StepSwitcher>
    </Step>
  );
}
