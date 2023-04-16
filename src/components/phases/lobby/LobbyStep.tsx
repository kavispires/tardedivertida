import { GameBanner } from 'components/general/GameBanner';
import { ReactNode } from 'react';

type LobbyStepProps = {
  info: GameInfo;
  children: ReactNode;
};

export function LobbyStep({ info, children }: LobbyStepProps) {
  return (
    <div className="lobby-step">
      <div className="lobby-step__card">
        <GameBanner title={info?.title} gameName={info?.gameName} className="lobby-step__banner" />
        <div className="lobby-step__content">{children}</div>
      </div>
    </div>
  );
}
