import type { ReactNode } from 'react';
// Ant Design Resources
import { Alert, Typography } from 'antd';
// Components
import { GameStrip } from 'components/general/GameBanner';
import { Translate } from 'components/language';
import { useGameInfoContext } from 'components/session/GameInfoContext';
// Sass
import styles from '../PhaseLobby.module.scss';

type LobbyStepProps = {
  /**
   * The child components to render
   */
  children: ReactNode;
  /**
   * Whether the lobby is locked from new players
   */
  isLocked: boolean;
};

/**
 *
 * @deprecated - delete, unused
 * @param param0
 * @returns
 */
export function LobbyStep({ children, isLocked }: LobbyStepProps) {
  const info = useGameInfoContext();

  return (
    <div className={styles.lobbyStep}>
      <div className={styles.lobbyStepCard}>
        <GameStrip
          title={info?.title}
          gameName={info?.gameName}
          className={styles.lobbyStepBanner}
          width={256}
        />
        <div className={styles.lobbyStepContent}>
          {isLocked ? (
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
              />
            </>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
}
