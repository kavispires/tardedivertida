import { getGameSession } from 'games/gameLoader';
import { Suspense } from 'react';
// Hooks
import { useGameMeta } from 'hooks/useGameMeta';
import { useIsGameStale } from 'hooks/useIsGameStale';
import { useLanguage } from 'hooks/useLanguage';
import { useLoading } from 'hooks/useLoading';
// Components
import { PageError } from 'components/errors';
import { LoadingPage } from 'components/loaders';

function Game() {
  const { translate } = useLanguage();
  const { isKeyLoading } = useLoading();

  const { gameId, gameName, createdAt } = useGameMeta();

  const isGameStale = useIsGameStale(createdAt);

  // Deffer to load screen if any major API call is running
  if (!gameId || isKeyLoading('meta')) {
    return <LoadingPage />;
  }

  if (isGameStale) {
    return (
      <PageError
        message={translate('Jogo Expirado', 'Expired Game')}
        description={translate(
          'Este jogo ou é muito antigo ou não existe',
          'This game is too old or does not exist',
        )}
      />
    );
  }

  if (gameId && gameName) {
    const GameSession = getGameSession(gameName);

    if (GameSession) {
      return (
        <Suspense fallback={<LoadingPage />}>
          <GameSession />
        </Suspense>
      );
    }
  }

  // If we get here, it's an error
  return <PageError />;
}

export default Game;
