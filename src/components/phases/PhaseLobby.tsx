import { useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect } from 'react';
import { useLocalStorage } from 'react-use';
// Ant Design Resources
import { Alert, Button, Typography } from 'antd';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
import { resetGlobalState, useGlobalState } from 'hooks/useGlobalState';
import { useStep } from 'hooks/useStep';
// Utils
import { PHASES } from 'utils/phases';
// Components
import { AdminMenuDrawer } from 'components/admin/AdminMenuDrawer';
import { GameStrip } from 'components/general/GameBanner';
import { DualTranslate } from 'components/language/DualTranslate';
import { Translate } from 'components/language/Translate';
import { PhaseContainer } from 'components/phases/PhaseContainer';
import { useGameInfoContext } from 'components/session/GameInfoContext';
// Internal
import { CloudBackground } from './lobby/CloudBackground';
import { StepJoin } from './lobby/StepJoin';
import { StepInfo } from './lobby/StepInfo';
import { StepWaiting } from './lobby/StepWaiting';
import { JoinedPlayers } from './lobby/JoinedPlayers';
import { LobbyRules } from './lobby/LobbyRules';
import { ImageBackground } from './lobby/ImageBackground';
import { VideoBackground } from './lobby/VideoBackground';
// Sass
import styles from './PhaseLobby.module.scss';

const Paragraph = motion.create(Typography.Paragraph);

export function PhaseLobby({ players, meta }: PhaseProps) {
  const { step, setStep } = useStep();
  const { currentUser, isAuthenticated } = useCurrentUserContext();
  const [, setUserId] = useGlobalState('userId');
  const [, setUsername] = useGlobalState('username');
  const [, setUserAvatarId] = useGlobalState('userAvatarId');
  const [localUsername] = useLocalStorage('username', '');
  const [localAvatarId] = useLocalStorage('avatarId', '');
  const info = useGameInfoContext();
  const queryClient = useQueryClient();

  const player = players?.[currentUser.id];

  useEffect(() => {
    if (player) {
      setStep(2);
      setUserId(player.id);
      setUsername(player.name);
      setUserAvatarId(player.avatarId);
    } else if (isAuthenticated) {
      setStep(1);
      resetGlobalState();
    } else {
      setStep(0);
      setUsername(localUsername ?? '');
      setUserAvatarId(localAvatarId ?? '');
    }
  }, [
    player,
    setStep,
    setUserId,
    setUsername,
    setUserAvatarId,
    isAuthenticated,
    localUsername,
    localAvatarId,
  ]);

  return (
    <PhaseContainer
      phase="LOBBY"
      allowedPhase={PHASES.DEFAULT.LOBBY}
      className={styles.lobby}
    >
      <motion.div
        className={styles.lobbyStep}
        layout
      >
        <motion.div className={styles.lobbyStepCard}>
          <GameStrip
            width={340}
            title={info?.title}
            gameName={info?.gameName}
            className={styles.lobbyStepBanner}
          />
          <div className={styles.lobbyStepContent}>
            <Paragraph
              className={`${styles.lobbyStepSummary} italic`}
              layoutId="lobby-step-summary"
            >
              <DualTranslate>{info.summary}</DualTranslate>
            </Paragraph>

            {meta.isLocked ? (
              <>
                <Typography.Title className={styles.lobbyStepTitle}>
                  <Translate
                    pt="Esse jogo está trancado"
                    en="This session is locked"
                  />
                </Typography.Title>

                <Alert
                  type="warning"
                  showIcon
                  title={
                    <Translate
                      pt="O jogo já foi iniciado e novos jogadores não podem ser adicionados"
                      en="The game has started and new players cannot be added at this time"
                    />
                  }
                  action={
                    <Button
                      onClick={() =>
                        queryClient.refetchQueries({
                          queryKey: ['meta', meta.gameId],
                        })
                      }
                    >
                      <Translate
                        pt="Recarregar jogo"
                        en="Reload game"
                      />
                    </Button>
                  }
                />
              </>
            ) : (
              <AnimatePresence mode="wait">
                {step === 0 && (
                  <motion.div
                    key="step-join"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <StepJoin setStep={setStep} />
                  </motion.div>
                )}
                {step === 1 && (
                  <motion.div
                    key="step-info"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <StepInfo
                      players={players}
                      setStep={setStep}
                    />
                  </motion.div>
                )}
                {step === 2 && (
                  <motion.div
                    key="step-waiting"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <StepWaiting players={players} />
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </motion.div>
        <div className={styles.lobbyStepWaiting}>
          {step === 2 && <LobbyRules players={players} />}

          <JoinedPlayers
            players={players}
            orientation={step === 1 ? 'vertical' : 'horizontal'}
          />
        </div>

        <AdminMenuDrawer
          state={{
            phase: 'LOBBY',
            round: { current: 0, total: 0, forceLastRound: false },
            players: {},
          }}
          players={players}
        />
      </motion.div>
      <VideoBackground />
      <CloudBackground />
      <ImageBackground />
    </PhaseContainer>
  );
}
