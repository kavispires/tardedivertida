// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Components
import { PageError } from 'components/errors/PageError';

/**
 * Phase component that displays an error screen with translated error message
 */
export function PhaseError({ state }: PhaseProps) {
  const { dualTranslate } = useLanguage();
  return (
    <PageError
      description={dualTranslate({
        en: `The phase "${state.phase}" is not defined for this game.`,
        pt: `A fase "${state.phase}" não está definida para este jogo.`,
      })}
    />
  );
}
