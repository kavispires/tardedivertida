import { lazy, Suspense, useEffect } from 'react';
import { useTitle } from 'react-use';
// Hooks
import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
import { useLanguage } from 'hooks/useLanguage';
// Components
import { LoadingPage } from 'components/loaders/LoadingPage';
// Pages
import { LoginModal } from 'pages/Me/components/LoginModal';
// Internal
import { DailyChrome } from './components/DailyChrome';
import { Hub } from './DailyHub';
import { getDailyName } from './utils';
import { DailyContextProvider, useDailyChallengeContext } from './hooks/useDailyChallengeContext';
// Sass
import './utils/daily.scss';

const DailyAlienadoGame = lazy(() =>
  import(/* webpackChunkName: "daily-alienado" */ './games/Alienado/DailyAlienadoGame').then((m) => ({
    default: m.DailyAlienadoGame,
  })),
);
const DailyAquiOGame = lazy(() =>
  import(/* webpackChunkName: "daily-aqui-o" */ './games/AquiO/DailyAquiOGame').then((m) => ({
    default: m.DailyAquiOGame,
  })),
);
const DailyArteRuimGame = lazy(() =>
  import(/* webpackChunkName: "daily-arte-ruim" */ './games/ArteRuim/DailyArteRuimGame').then((m) => ({
    default: m.DailyArteRuimGame,
  })),
);
const DailyConjuntosGame = lazy(() =>
  import(/* webpackChunkName: "daily-conjuntos" */ './games/Conjuntos/DailyConjuntosGame').then((m) => ({
    default: m.DailyConjuntosGame,
  })),
);
const DailyConexoesGame = lazy(() =>
  import(/* webpackChunkName: "daily-conexoes" */ './games/Conexoes/DailyConexoesGame').then((m) => ({
    default: m.DailyConexoesGame,
  })),
);
const DailyEstoquistaGame = lazy(() =>
  import(/* webpackChunkName: "daily-estoquista" */ './games/Estoquista/DailyEstoquistaGame').then((m) => ({
    default: m.DailyEstoquistaGame,
  })),
);
const DailyFilmacoGame = lazy(() =>
  import(/* webpackChunkName: "daily-filmaco" */ './games/Filmaco/DailyFilmacoGame').then((m) => ({
    default: m.DailyFilmacoGame,
  })),
);
const DailyInvestigacaoGame = lazy(() =>
  import(/* webpackChunkName: "daily-investigacao" */ './games/Investigacao/DailyInvestigacaoGame').then(
    (m) => ({ default: m.DailyInvestigacaoGame }),
  ),
);
const DailyMapeamentoGame = lazy(() =>
  import(/* webpackChunkName: "daily-mapeamento" */ './games/Mapeamento/DailyMapeamentoGame').then((m) => ({
    default: m.DailyMapeamentoGame,
  })),
);
const DailyOrganikuGame = lazy(() =>
  import(/* webpackChunkName: "daily-organiku" */ './games/Organiku/DailyOrganikuGame').then((m) => ({
    default: m.DailyOrganikuGame,
  })),
);
const DailyPalavreadoGame = lazy(() =>
  import(/* webpackChunkName: "daily-palavreado" */ './games/Palavreado/DailyPalavreadoGame').then((m) => ({
    default: m.DailyPalavreadoGame,
  })),
);
const DailyPanicoGame = lazy(() =>
  import(/* webpackChunkName: "daily-panico" */ './games/Panico/DailyPanicoGame').then((m) => ({
    default: m.DailyPanicoGame,
  })),
);
const DailyPicacoGame = lazy(() =>
  import(/* webpackChunkName: "daily-picaco" */ './games/Picaco/DailyPicacoGame').then((m) => ({
    default: m.DailyPicacoGame,
  })),
);
const DailyPirralhosGame = lazy(() =>
  import(/* webpackChunkName: "daily-pirralhos" */ './games/Pirralhos/DailyPirralhosGame').then((m) => ({
    default: m.DailyPirralhosGame,
  })),
);
const DailyPortaisGame = lazy(() =>
  import(/* webpackChunkName: "daily-portais" */ './games/Portais/DailyPortaisGame').then((m) => ({
    default: m.DailyPortaisGame,
  })),
);
const DailyQuartetosGame = lazy(() =>
  import(/* webpackChunkName: "daily-quartetos" */ './games/Quartetos/DailyQuartetosGame').then((m) => ({
    default: m.DailyQuartetosGame,
  })),
);
const DailyTaNaCaraGame = lazy(() =>
  import(/* webpackChunkName: "daily-ta-na-cara" */ './games/TaNaCara/DailyTaNaCaraGame').then((m) => ({
    default: m.DailyTaNaCaraGame,
  })),
);
const DailyVitralGame = lazy(() =>
  import(/* webpackChunkName: "daily-vitral" */ './games/Vitral/DailyVitralGame').then((m) => ({
    default: m.DailyVitralGame,
  })),
);
const VitraisInfinitosGame = lazy(() =>
  import(
    /* webpackChunkName: "daily-vitrais-infinitos" */ './games/VitraisInfinitos/VitraisInfinitosGame'
  ).then((m) => ({ default: m.VitraisInfinitosGame })),
);
const DailyDemoPage = lazy(() =>
  import(/* webpackChunkName: "daily-demo" */ './games/Demo/DailyDemoPage').then((m) => ({
    default: m.DailyDemoPage,
  })),
);
const DebugPage = lazy(() =>
  import(/* webpackChunkName: "daily-debug" */ './Debug').then((m) => ({ default: m.DebugPage })),
);

function DailyPage() {
  const { isAuthenticated } = useCurrentUserContext();
  const { setLanguage, language } = useLanguage();

  // biome-ignore lint/correctness/useExhaustiveDependencies: function is not a dependency
  useEffect(() => {
    if (language !== 'pt') {
      // Set the language to Portuguese if it's not
      setLanguage('pt');
    }
  }, [language]);

  useTitle(`${getDailyName(language)} - Tarde Divertida`);

  if (!isAuthenticated) {
    return (
      <DailyContextProvider>
        <DailyChrome>
          <LoginModal isAuthenticated={false} />
        </DailyChrome>
      </DailyContextProvider>
    );
  }

  return (
    <DailyContextProvider>
      <AuthenticatedDailyContent />
    </DailyContextProvider>
  );
}

function AuthenticatedDailyContent() {
  const { activeGame } = useDailyChallengeContext();

  const gameRoutes: Record<string, React.ComponentType> = {
    // Hub
    '': Hub,
    hub: Hub,
    // Games
    alienado: DailyAlienadoGame,
    'aqui-o': DailyAquiOGame,
    'arte-ruim': DailyArteRuimGame,
    conjuntos: DailyConjuntosGame,
    estoquista: DailyEstoquistaGame,
    investigacao: DailyInvestigacaoGame,
    filmaco: DailyFilmacoGame,
    mapeamento: DailyMapeamentoGame,
    organiku: DailyOrganikuGame,
    palavreado: DailyPalavreadoGame,
    pirralhos: DailyPirralhosGame,
    panico: DailyPanicoGame,
    portais: DailyPortaisGame,
    quartetos: DailyQuartetosGame,
    vitral: DailyVitralGame,
    // Contribute
    conexoes: DailyConexoesGame,
    picaco: DailyPicacoGame,
    'ta-na-cara': DailyTaNaCaraGame,
    demo: DailyDemoPage,
    // Endless games
    'vitrais-infinitos': VitraisInfinitosGame,
    // Dev
    debug: DebugPage,
  };

  const Outlet = gameRoutes[activeGame ?? ''] ?? Hub;

  return (
    <Suspense fallback={<LoadingPage />}>
      <Outlet />
    </Suspense>
  );
}

export default DailyPage;
