import { useEffect, useMemo, useState } from 'react';
import { useTimer } from 'react-timer-hook';
// Design Resources
import { HeartFilled } from '@ant-design/icons';
// Hooks
import { inNSeconds } from '../../utils/helpers';
// Components
import {
  AdminNextRoundButton,
  Instruction,
  RankingBoard,
  Step,
  StepSwitcher,
  Title,
  Translate,
} from '../../components';
import { Pasture } from './Pasture';
import { RoundType } from './RoundType';

type ResolutionStepProps = {
  ranking: GameRanking;
  players: GamePlayers;
  roundType: number;
  pastureChangeStr: string;
  round: GameRound;
  announceSave: boolean;
};

export function ResolutionStep({
  ranking,
  players,
  roundType,
  pastureChangeStr,
  round,
  announceSave = false,
}: ResolutionStepProps) {
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

      <RoundType roundType={roundType} />

      <StepSwitcher step={step}>
        <Step key={0}>
          <RankingBoard ranking={ranking} players={players} />
        </Step>

        <Step key={1}>
          {showAnnounceSave && (
            <Instruction contained className="m-save-card">
              <HeartFilled style={{ color: 'red' }} />
              <Translate
                en="Vamos dar uma última chance para a pobre ovelhinha que
              ia morrer agora"
                pt="Let's give one more chance to the poor sheep about to die. The last one!"
              />
              <HeartFilled style={{ color: 'red' }} />
            </Instruction>
          )}
          <Pasture players={pastureChange[pastureIndex]} />
          <AdminNextRoundButton round={round} />
        </Step>
      </StepSwitcher>
    </Step>
  );
}
