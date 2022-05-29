import { lazy, Suspense, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// Ant Design Resources
import { message, notification } from 'antd';
// Adapters
import { GAME_API } from 'services/adapters';
// Hooks
import { useIsGameStale, useLoading, useGlobalState, useLocalStorage } from 'hooks';
// Utils
import { isValidGameId, isDevEnv, getGameIdFromPathname } from 'utils/helpers';
import { GAME_COLLECTION } from 'utils/constants';
// Components
import { PageError } from 'components/errors';
import { LoadingPage } from 'components/loaders';

// Game lazy imports
const SessionArteRuim = lazy(
  () => import('games/arte-ruim/SessionArteRuim' /* webpackChunkName: "arte-ruim" */)
);
const SessionContadoresHistorias = lazy(
  () =>
    import(
      'games/contadores-historias/SessionContadoresHistorias' /* webpackChunkName: "contadores-historias" */
    )
);
const SessionCrimesHediondos = lazy(
  () => import('games/crimes-hediondos/SessionCrimesHediondos' /* webpackChunkName: "crimes-hediondos" */)
);
const SessionCruzaPalavras = lazy(
  () => import('games/cruza-palavras/SessionCruzaPalavras' /* webpackChunkName: "cruza-palavras" */)
);
const SessionDetetivesImaginativos = lazy(
  () =>
    import(
      'games/detetives-imaginativos/SessionDetetivesImaginativos' /* webpackChunkName: "detetives-imaginativos" */
    )
);
const SessionEspiaoEntreNos = lazy(
  () => import('games/espiao-entre-nos/SessionEspiaoEntreNos' /* webpackChunkName: "espiao-entre-nos" */)
);
const SessionGaleriaDeSonhos = lazy(
  () => import('games/galeria-de-sonhos/SessionGaleriaDeSonhos' /* webpackChunkName: "galeria-de-sonhos" */)
);
const SessionInstrumentosCodificados = lazy(
  () =>
    import(
      'games/instrumentos-codificados/SessionInstrumentosCodificados' /* webpackChunkName: "instrumentos-codificados" */
    )
);
const SessionLinhasCruzadas = lazy(
  () => import('games/linhas-cruzadas/SessionLinhasCruzadas' /* webpackChunkName: "linhas-cruzadas" */)
);
const SessionMenteColetiva = lazy(
  () => import('games/mente-coletiva/SessionMenteColetiva' /* webpackChunkName: "mente-coletiva" */)
);
const SessionNaRuaDoMedo = lazy(
  () => import('games/na-rua-do-medo/SessionNaRuaDoMedo' /* webpackChunkName: "na-rua-do-medo" */)
);
const SessionOndaTelepatica = lazy(
  () => import('games/onda-telepatica/SessionOndaTelepatica' /* webpackChunkName: "onda-telepatica" */)
);
const SessionPolemicaDaVez = lazy(
  () => import('games/polemica-da-vez/SessionPolemicaDaVez' /* webpackChunkName: "polemica-da-vez" */)
);
const SessionRetratoFalado = lazy(
  () => import('games/retrato-falado/SessionRetratoFalado' /* webpackChunkName: "retrato-falado" */)
);
const SessionSonhosPesadelos = lazy(
  () => import('games/sonhos-pesadelos/SessionSonhosPesadelos' /* webpackChunkName: "sonhos-pesadelos" */)
);
const SessionTestemunhaOcular = lazy(
  () => import('games/testemunha-ocular/SessionTestemunhaOcular' /* webpackChunkName: "testemunha-ocular" */)
);
const SessionUeSoIsso = lazy(
  () => import('games/ue-so-isso/SessionUeSoIsso' /* webpackChunkName: "ue-so-isso" */)
);
const SessionVendavalDePalpite = lazy(
  () => import('games/vendaval-de-palpite/SessionVendavalDePalpite' /* webpackChunkName: "ue-so-isso" */)
);

function Game() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { setLoader } = useLoading();
  const [gameId, setGameId] = useGlobalState('gameId');
  const [gameName, setGameName] = useGlobalState('gameName');
  const [gameMeta, setGameMeta] = useGlobalState('gameMeta');
  const [, setUserId] = useGlobalState('userId');
  const [, setUsername] = useGlobalState('username');
  const [, setUserAvatarId] = useGlobalState('userAvatarId');
  const [, setLanguage] = useGlobalState('language');
  const [, setLocalStorage] = useLocalStorage();

  const [isPageLoading, setPageLoading] = useState(true);
  const isGameStale = useIsGameStale(gameMeta?.createdAt);

  // Verify url game code
  useEffect(() => {
    const urlGameId = getGameIdFromPathname(pathname);
    if (isValidGameId(urlGameId)) {
      setGameId(urlGameId);
    } else {
      message.error('Vixi, a id do jogo na barra de endereços tá errada');
      navigate('/');
    }
  }, [pathname, navigate, setGameId, setUsername, setUserAvatarId]);

  // Keep track of url changes
  useEffect(() => {
    const urlGameId = getGameIdFromPathname(pathname);
    if (isValidGameId(urlGameId)) {
      setGameId(urlGameId);
      setUserId(null);
      setUsername('');
      setUserAvatarId('');
      message.info('New id provided');
    } else {
      message.error('Oops, the game id in the address bar is incorrect');
      navigate('/');
    }
  }, [pathname, navigate, setGameId, setUsername, setUserAvatarId, setUserId]);

  // Load game
  useEffect(() => {
    setPageLoading(true);
    async function loadGameSession() {
      try {
        setLoader('load', true);
        const meta: PlainObject = await GAME_API.loadGame({ gameId });
        if (isDevEnv) {
          console.log({ meta: meta.data });
        }
        setGameName(meta.data.gameName);
        setGameMeta(meta.data);
        setLanguage(meta.data?.language ?? 'pt');
        setLocalStorage({ language: meta.data?.language ?? 'pt' });
      } catch (e: any) {
        console.error(e);
        notification.error({
          message: 'Failed to load game',
          description: JSON.stringify(e.message),
        });
        console.error(e);
      } finally {
        setPageLoading(false);
        setLoader('load', false);
      }
    }

    if (gameId) {
      loadGameSession();
    }
  }, [gameId]); // eslint-disable-line

  // Deffer to load screen if any major API call is running
  if (isPageLoading) {
    return <LoadingPage />;
  }

  if (isGameStale) {
    return <PageError message="Expired Game" description="This game is too old or does not exist" />;
  }

  if (gameId && gameName) {
    switch (gameName) {
      case GAME_COLLECTION.ARTE_RUIM:
        return (
          <Suspense fallback={<LoadingPage message={''} />}>
            <SessionArteRuim gameId={gameId} />
          </Suspense>
        );
      case GAME_COLLECTION.CONTADORES_HISTORIAS:
        return (
          <Suspense fallback={<LoadingPage message={''} />}>
            <SessionContadoresHistorias gameId={gameId} />
          </Suspense>
        );
      case GAME_COLLECTION.DETETIVES_IMAGINATIVOS:
        return (
          <Suspense fallback={<LoadingPage message={''} />}>
            <SessionDetetivesImaginativos gameId={gameId} />
          </Suspense>
        );
      case GAME_COLLECTION.ESPIAO_ENTRE_NOS:
        return (
          <Suspense fallback={<LoadingPage message={''} />}>
            <SessionEspiaoEntreNos gameId={gameId} />
          </Suspense>
        );
      case GAME_COLLECTION.GALERIA_DE_SONHOS:
        return (
          <Suspense fallback={<LoadingPage message={''} />}>
            <SessionGaleriaDeSonhos gameId={gameId} />
          </Suspense>
        );
      case GAME_COLLECTION.CRIMES_HEDIONDOS:
        return (
          <Suspense fallback={<LoadingPage message={''} />}>
            <SessionCrimesHediondos gameId={gameId} />
          </Suspense>
        );
      case GAME_COLLECTION.INSTRUMENTOS_CODIFICADOS:
        return (
          <Suspense fallback={<LoadingPage message={''} />}>
            <SessionInstrumentosCodificados gameId={gameId} />
          </Suspense>
        );
      case GAME_COLLECTION.LINHAS_CRUZADAS:
        return (
          <Suspense fallback={<LoadingPage message={''} />}>
            <SessionLinhasCruzadas gameId={gameId} />
          </Suspense>
        );
      case GAME_COLLECTION.MENTE_COLETIVA:
        return (
          <Suspense fallback={<LoadingPage message={''} />}>
            <SessionMenteColetiva gameId={gameId} />
          </Suspense>
        );
      case GAME_COLLECTION.NA_RUA_DO_MEDO:
        return (
          <Suspense fallback={<LoadingPage message={''} />}>
            <SessionNaRuaDoMedo gameId={gameId} />
          </Suspense>
        );
      case GAME_COLLECTION.ONDA_TELEPATICA:
        return (
          <Suspense fallback={<LoadingPage message={''} />}>
            <SessionOndaTelepatica gameId={gameId} />
          </Suspense>
        );
      case GAME_COLLECTION.POLEMICA_DA_VEZ:
        return (
          <Suspense fallback={<LoadingPage message={''} />}>
            <SessionPolemicaDaVez gameId={gameId} />
          </Suspense>
        );
      case GAME_COLLECTION.RETRATO_FALADO:
        return (
          <Suspense fallback={<LoadingPage message={''} />}>
            <SessionRetratoFalado gameId={gameId} />
          </Suspense>
        );
      case GAME_COLLECTION.SONHOS_PESADELOS:
        return (
          <Suspense fallback={<LoadingPage message={''} />}>
            <SessionSonhosPesadelos gameId={gameId} />
          </Suspense>
        );
      case GAME_COLLECTION.TESTEMUNHA_OCULAR:
        return (
          <Suspense fallback={<LoadingPage message={''} />}>
            <SessionTestemunhaOcular gameId={gameId} />
          </Suspense>
        );
      case GAME_COLLECTION.UE_SO_ISSO:
        return (
          <Suspense fallback={<LoadingPage message={''} />}>
            <SessionUeSoIsso gameId={gameId} />
          </Suspense>
        );
      case GAME_COLLECTION.VENDAVAL_DE_PALPITE:
        return (
          <Suspense fallback={<LoadingPage message={''} />}>
            <SessionVendavalDePalpite gameId={gameId} />
          </Suspense>
        );
      case GAME_COLLECTION.CRUZA_PALAVRAS:
        return (
          <Suspense fallback={<LoadingPage message={''} />}>
            <SessionCruzaPalavras gameId={gameId} />
          </Suspense>
        );
      default:
        console.warn('Wrong game library provided');
    }
  }

  // If switch fails, it's an error
  return <PageError />;
}

export default Game;
