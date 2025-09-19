import { AnimatePresence, motion } from 'motion/react';
import { useEffect } from 'react';
import { useLocalStorage } from 'react-use';
// Ant Design Resources
import { Alert, Typography } from 'antd';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
import { resetGlobalState, useGlobalState } from 'hooks/useGlobalState';
import { useStep } from 'hooks/useStep';
// Utils
import { PHASES } from 'utils/phases';
// Components
import { AdminMenuDrawer } from 'components/admin';
import { GameStrip } from 'components/general/GameBanner';
import { DualTranslate, Translate } from 'components/language';
import { PhaseContainer } from 'components/phases';
import { useGameInfoContext } from 'components/session/GameInfoContext';
// Internal
import { CloudBackground } from './lobby/CloudBackground';
import { StepJoin } from './lobby/StepJoin';
import { StepInfo } from './lobby/StepInfo';
import { StepWaiting } from './lobby/StepWaiting';
import { JoinedPlayers } from './lobby/JoinedPlayers';
import { LobbyRules } from './lobby/LobbyRules';
// Sass
import './PhaseLobby.scss';

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
    <PhaseContainer phase="LOBBY" allowedPhase={PHASES.DEFAULT.LOBBY} className="lobby">
      <AnimatePresence>
        <motion.div className="lobby-step" layout>
          <motion.div className="lobby-step__card">
            <GameStrip
              width={340}
              title={info?.title}
              gameName={info?.gameName}
              className="lobby-step__banner"
            />
            <div className="lobby-step__content">
              <Paragraph className="lobby-step__summary italic" layoutId="lobby-step-summary">
                <DualTranslate>{info.summary}</DualTranslate>
              </Paragraph>

              {meta.isLocked ? (
                <>
                  <Typography.Title className="lobby-step__title">
                    <Translate pt="Esse jogo está trancado" en="This session is locked" />
                  </Typography.Title>

                  <Alert
                    type="warning"
                    showIcon
                    message={
                      <Translate
                        pt="O jogo já foi iniciado e novos jogadores não podem ser adicionados"
                        en="The game has started and new players cannot be added at this time"
                      />
                    }
                  />
                </>
              ) : (
                <>
                  {step === 0 && <StepJoin setStep={setStep} />}
                  {step === 1 && <StepInfo players={players} setStep={setStep} />}
                  {step === 2 && <StepWaiting players={players} />}
                </>
              )}
            </div>
          </motion.div>
          <div className="lobby-step__waiting">
            {step === 2 && <LobbyRules players={players} />}

            <JoinedPlayers players={players} orientation={step === 1 ? 'vertical' : 'horizontal'} />
          </div>
        </motion.div>

        <AdminMenuDrawer
          state={{
            phase: 'LOBBY',
            round: { current: 0, total: 0, forceLastRound: false },
            players: {},
          }}
          players={players}
        />
      </AnimatePresence>
      <CloudBackground />
    </PhaseContainer>
  );
}
