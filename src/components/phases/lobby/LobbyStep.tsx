import type { ReactNode } from 'react';
// Ant Design Resources
import { Alert } from 'antd';
// Components
import { GameBanner } from 'components/general/GameBanner';
import { Translate } from 'components/language';
import { useGameInfoContext } from 'components/session/GameInfoContext';

type LobbyStepProps = {
  children: ReactNode;
  isLocked: boolean;
};

export function LobbyStep({ children, isLocked }: LobbyStepProps) {
  const info = useGameInfoContext();

  return (
    <div className="lobby-step">
      <div className="lobby-step__card">
        <GameBanner title={info?.title} gameName={info?.gameName} className="lobby-step__banner" />
        <div className="lobby-step__content">
          {isLocked ? (
            <>
              <h1 className="lobby-step__title">
                <Translate pt="Esse jogo está trancado" en="This session is locked" />
              </h1>

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
            children
          )}
        </div>
      </div>
    </div>
  );
}
