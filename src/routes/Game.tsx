import { lazy, Suspense, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// Ant Design Resources
import { message, notification } from 'antd';
// Adapters
import { GAME_API } from 'adapters';
// Hooks
import { useIsGameStale, useLoading, useGlobalState, useLocalStorage } from 'hooks';
// Utils
import { isValidGameId, isDevEnv, getGameIdFromPathname } from 'utils/helpers';
import { GAME_COLLECTION } from 'utils/constants';
// Components
import { LoadingPage, PageError } from 'components';
// Game lazy imports
const SessionArteRuim = lazy(() => import('games/arte-ruim/SessionArteRuim'));
const SessionContadoresHistorias = lazy(
  () => import('games/contadores-historias/SessionContadoresHistorias')
);
const SessionCrimesHediondos = lazy(() => import('games/crimes-hediondos/SessionCrimesHediondos'));
const SessionCruzaPalavras = lazy(() => import('games/cruza-palavras/SessionCruzaPalavras'));
const SessionDetetivesImaginativos = lazy(
  () => import('games/detetives-imaginativos/SessionDetetivesImaginativos')
);
const SessionEspiaoEntreNos = lazy(() => import('games/espiao-entre-nos/SessionEspiaoEntreNos'));
const SessionGaleriaDeSonhos = lazy(() => import('games/galeria-de-sonhos/SessionGaleriaDeSonhos'));
const SessionInstrumentosCodificados = lazy(
  () => import('games/instrumentos-codificados/SessionInstrumentosCodificados')
);
const SessionLinhasCruzadas = lazy(() => import('games/linhas-cruzadas/SessionLinhasCruzadas'));
const SessionMenteColetiva = lazy(() => import('games/mente-coletiva/SessionMenteColetiva'));
const SessionNaRuaDoMedo = lazy(() => import('games/na-rua-do-medo/SessionNaRuaDoMedo'));
const SessionOndaTelepatica = lazy(() => import('games/onda-telepatica/SessionOndaTelepatica'));
const SessionPolemicaDaVez = lazy(() => import('games/polemica-da-vez/SessionPolemicaDaVez'));
const SessionRetratoFalado = lazy(() => import('games/retrato-falado/SessionRetratoFalado'));
const SessionSonhosPesadelos = lazy(() => import('games/sonhos-pesadelos/SessionSonhosPesadelos'));
const SessionTestemunhaOcular = lazy(() => import('games/testemunha-ocular/SessionTestemunhaOcular'));
const SessionUeSoIsso = lazy(() => import('games/ue-so-isso/SessionUeSoIsso'));

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

  // // Keeps track of url changes
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
            <SessionArteRuim gameId={gameId} />;
          </Suspense>
        );
      case GAME_COLLECTION.CONTADORES_HISTORIAS:
        return (
          <Suspense fallback={<LoadingPage message={''} />}>
            <SessionContadoresHistorias gameId={gameId} />;
          </Suspense>
        );
      case GAME_COLLECTION.DETETIVES_IMAGINATIVOS:
        return (
          <Suspense fallback={<LoadingPage message={''} />}>
            <SessionDetetivesImaginativos gameId={gameId} />;
          </Suspense>
        );
      case GAME_COLLECTION.ESPIAO_ENTRE_NOS:
        return (
          <Suspense fallback={<LoadingPage message={''} />}>
            <SessionEspiaoEntreNos gameId={gameId} />;
          </Suspense>
        );
      case GAME_COLLECTION.GALERIA_DE_SONHOS:
        return (
          <Suspense fallback={<LoadingPage message={''} />}>
            <SessionGaleriaDeSonhos gameId={gameId} />;
          </Suspense>
        );
      case GAME_COLLECTION.CRIMES_HEDIONDOS:
        return (
          <Suspense fallback={<LoadingPage message={''} />}>
            <SessionCrimesHediondos gameId={gameId} />;
          </Suspense>
        );
      case GAME_COLLECTION.INSTRUMENTOS_CODIFICADOS:
        return (
          <Suspense fallback={<LoadingPage message={''} />}>
            <SessionInstrumentosCodificados gameId={gameId} />;
          </Suspense>
        );
      case GAME_COLLECTION.LINHAS_CRUZADAS:
        return (
          <Suspense fallback={<LoadingPage message={''} />}>
            <SessionLinhasCruzadas gameId={gameId} />;
          </Suspense>
        );
      case GAME_COLLECTION.MENTE_COLETIVA:
        return (
          <Suspense fallback={<LoadingPage message={''} />}>
            <SessionMenteColetiva gameId={gameId} />;
          </Suspense>
        );
      case GAME_COLLECTION.NA_RUA_DO_MEDO:
        return (
          <Suspense fallback={<LoadingPage message={''} />}>
            <SessionNaRuaDoMedo gameId={gameId} />;
          </Suspense>
        );
      case GAME_COLLECTION.ONDA_TELEPATICA:
        return (
          <Suspense fallback={<LoadingPage message={''} />}>
            <SessionOndaTelepatica gameId={gameId} />;
          </Suspense>
        );
      case GAME_COLLECTION.POLEMICA_DA_VEZ:
        return (
          <Suspense fallback={<LoadingPage message={''} />}>
            <SessionPolemicaDaVez gameId={gameId} />;
          </Suspense>
        );
      case GAME_COLLECTION.RETRATO_FALADO:
        return (
          <Suspense fallback={<LoadingPage message={''} />}>
            <SessionRetratoFalado gameId={gameId} />;
          </Suspense>
        );
      case GAME_COLLECTION.SONHOS_PESADELOS:
        return (
          <Suspense fallback={<LoadingPage message={''} />}>
            <SessionSonhosPesadelos gameId={gameId} />;
          </Suspense>
        );
      case GAME_COLLECTION.TESTEMUNHA_OCULAR:
        return (
          <Suspense fallback={<LoadingPage message={''} />}>
            <SessionTestemunhaOcular gameId={gameId} />;
          </Suspense>
        );
      case GAME_COLLECTION.UE_SO_ISSO:
        return (
          <Suspense fallback={<LoadingPage message={''} />}>
            <SessionUeSoIsso gameId={gameId} />;
          </Suspense>
        );
      case GAME_COLLECTION.CRUZA_PALAVRAS:
        return (
          <Suspense fallback={<LoadingPage message={''} />}>
            <SessionCruzaPalavras gameId={gameId} />;
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
