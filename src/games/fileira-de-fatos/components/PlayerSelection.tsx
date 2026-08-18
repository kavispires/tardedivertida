import { useMemo } from 'react';
// Types
import type { GamePlayer } from 'types/game';
import type { TextCardData } from 'types/tdr';

type PlayerSelectionProps = {
  scenarios: TextCardData[];
  user: GamePlayer;
};

export function PlayerSelection({ scenarios, user }: PlayerSelectionProps) {
  const orderedScenarios = useMemo(() => {
    const choices = user.currentOrder ?? [];
    return choices.map((id: UID) => scenarios.find((s) => s.id === id)).filter(Boolean) as TextCardData[];
  }, [scenarios, user.currentOrder]);

  return (
    <div className="waiting-room-scenarios">
      {orderedScenarios.map((scenario) => (
        <div
          key={scenario.id}
          className="waiting-room-scenarios__entry"
        >
          {scenario.text}
        </div>
      ))}
    </div>
  );
}
