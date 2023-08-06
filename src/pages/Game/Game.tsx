import { lazy, Suspense } from 'react';
// Hooks
import { useIsGameStale } from 'hooks/useIsGameStale';
import { useLanguage } from 'hooks/useLanguage';
import { useGameMeta } from 'hooks/useGameMeta';
import { useLoading } from 'hooks/useLoading';
// Utils
import { GAME_COLLECTION } from 'utils/constants';
// Components
import { PageError } from 'components/errors';
import { LoadingPage } from 'components/loaders';

// Game lazy imports
const SessionArteRuim = lazy(
  () => import('games/arte-ruim/SessionArteRuim' /* webpackChunkName: "arte-ruim" */)
);
const SessionComunicacaoAlienigena = lazy(
  () =>
    import(
      'games/comunicacao-alienigena/SessionComunicacaoAlienigena' /* webpackChunkName: "comunicacao-alienigena" */
    )
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
const SessionFileiraDeFatos = lazy(
  () => import('games/fileira-de-fatos/SessionFileiraDeFatos' /* webpackChunkName: "fileira-de-fatos" */)
);
const SessionGaleriaDeSonhos = lazy(
  () => import('games/galeria-de-sonhos/SessionGaleriaDeSonhos' /* webpackChunkName: "galeria-de-sonhos" */)
);
const SessionPortaDosDesesperados = lazy(
  () =>
    import(
      'games/porta-dos-desesperados/SessionPortaDosDesesperados' /* webpackChunkName: "porta-dos-desesperados" */
    )
);
const SessionLabirintoSecreto = lazy(
  () => import('games/labirinto-secreto/SessionLabirintoSecreto' /* webpackChunkName: "labirinto-secreto" */)
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
const SessionQuemNaoMata = lazy(
  () => import('games/quem-nao-mata/SessionQuemNaoMata' /* webpackChunkName: "quem-nao-mata" */)
);
const SessionRetratoFalado = lazy(
  () => import('games/retrato-falado/SessionRetratoFalado' /* webpackChunkName: "retrato-falado" */)
);
const SessionSonhosPesadelos = lazy(
  () => import('games/sonhos-pesadelos/SessionSonhosPesadelos' /* webpackChunkName: "sonhos-pesadelos" */)
);
const SessionSuperCampeonato = lazy(
  () => import('games/super-campeonato/SessionSuperCampeonato' /* webpackChunkName: "super-campeonato" */)
);
const SessionTestemunhaOcular = lazy(
  () => import('games/testemunha-ocular/SessionTestemunhaOcular' /* webpackChunkName: "testemunha-ocular" */)
);
const SessionTrevoDaSorte = lazy(
  () => import('games/trevo-da-sorte/SessionTrevoDaSorte' /* webpackChunkName: "trevo-da-sorte" */)
);
const SessionUeSoIsso = lazy(
  () => import('games/ue-so-isso/SessionUeSoIsso' /* webpackChunkName: "ue-so-isso" */)
);
const SessionVamosAoCinema = lazy(
  () => import('games/vamos-ao-cinema/SessionVamosAoCinema' /* webpackChunkName: "vamos-ao-cinema" */)
);
const SessionVendavalDePalpite = lazy(
  () =>
    import('games/vendaval-de-palpite/SessionVendavalDePalpite' /* webpackChunkName: "vendaval-de-palpite" */)
);
const SessionMegamix = lazy(() => import('games/megamix/SessionMegamix' /* webpackChunkName: "megamix" */));
const SessionQuemSouEu = lazy(
  () => import('games/quem-sou-eu/SessionQuemSouEu' /* webpackChunkName: "quem-sou-eu" */)
);
const SessionTaNaCara = lazy(
  () => import('games/ta-na-cara/SessionTaNaCara' /* webpackChunkName: "ta-na-cara" */)
);

function Game() {
  const { translate } = useLanguage();
  const { loaders } = useLoading();

  const { gameId, gameName, createdAt } = useGameMeta();

  const isGameStale = useIsGameStale(createdAt);

  // Deffer to load screen if any major API call is running
  if (!gameId || loaders['meta']) {
    return <LoadingPage />;
  }

  if (isGameStale) {
    return (
      <PageError
        message={translate('Jogo Expirado', 'Expired Game')}
        description={translate(
          'Este jogo ou é muito antigo ou não existe',
          'This game is too old or does not exist'
        )}
      />
    );
  }

  if (gameId && gameName) {
    switch (gameName) {
      case GAME_COLLECTION.ARTE_RUIM:
        return (
          <Suspense fallback={<LoadingPage />}>
            <SessionArteRuim />
          </Suspense>
        );
      case GAME_COLLECTION.COMUNICACAO_ALIENIGENA:
        return (
          <Suspense fallback={<LoadingPage />}>
            <SessionComunicacaoAlienigena />
          </Suspense>
        );
      case GAME_COLLECTION.CONTADORES_HISTORIAS:
        return (
          <Suspense fallback={<LoadingPage />}>
            <SessionContadoresHistorias />
          </Suspense>
        );
      case GAME_COLLECTION.CRUZA_PALAVRAS:
        return (
          <Suspense fallback={<LoadingPage />}>
            <SessionCruzaPalavras />
          </Suspense>
        );
      case GAME_COLLECTION.DETETIVES_IMAGINATIVOS:
        return (
          <Suspense fallback={<LoadingPage />}>
            <SessionDetetivesImaginativos />
          </Suspense>
        );
      case GAME_COLLECTION.ESPIAO_ENTRE_NOS:
        return (
          <Suspense fallback={<LoadingPage />}>
            <SessionEspiaoEntreNos />
          </Suspense>
        );
      case GAME_COLLECTION.FILEIRA_DE_FATOS:
        return (
          <Suspense fallback={<LoadingPage />}>
            <SessionFileiraDeFatos />
          </Suspense>
        );
      case GAME_COLLECTION.GALERIA_DE_SONHOS:
        return (
          <Suspense fallback={<LoadingPage />}>
            <SessionGaleriaDeSonhos />
          </Suspense>
        );
      case GAME_COLLECTION.CRIMES_HEDIONDOS:
        return (
          <Suspense fallback={<LoadingPage />}>
            <SessionCrimesHediondos />
          </Suspense>
        );
      case GAME_COLLECTION.PORTA_DOS_DESESPERADOS:
        return (
          <Suspense fallback={<LoadingPage />}>
            <SessionPortaDosDesesperados />
          </Suspense>
        );
      case GAME_COLLECTION.LABIRINTO_SECRETO:
        return (
          <Suspense fallback={<LoadingPage />}>
            <SessionLabirintoSecreto />
          </Suspense>
        );
      case GAME_COLLECTION.LINHAS_CRUZADAS:
        return (
          <Suspense fallback={<LoadingPage />}>
            <SessionLinhasCruzadas />
          </Suspense>
        );
      case GAME_COLLECTION.MEGAMIX:
        return (
          <Suspense fallback={<LoadingPage />}>
            <SessionMegamix />
          </Suspense>
        );
      case GAME_COLLECTION.MENTE_COLETIVA:
        return (
          <Suspense fallback={<LoadingPage />}>
            <SessionMenteColetiva />
          </Suspense>
        );
      case GAME_COLLECTION.NA_RUA_DO_MEDO:
        return (
          <Suspense fallback={<LoadingPage />}>
            <SessionNaRuaDoMedo />
          </Suspense>
        );
      case GAME_COLLECTION.ONDA_TELEPATICA:
        return (
          <Suspense fallback={<LoadingPage />}>
            <SessionOndaTelepatica />
          </Suspense>
        );
      case GAME_COLLECTION.POLEMICA_DA_VEZ:
        return (
          <Suspense fallback={<LoadingPage />}>
            <SessionPolemicaDaVez />
          </Suspense>
        );
      case GAME_COLLECTION.QUEM_NAO_MATA:
        return (
          <Suspense fallback={<LoadingPage />}>
            <SessionQuemNaoMata />
          </Suspense>
        );
      case GAME_COLLECTION.QUEM_SOU_EU:
        return (
          <Suspense fallback={<LoadingPage />}>
            <SessionQuemSouEu />
          </Suspense>
        );
      case GAME_COLLECTION.RETRATO_FALADO:
        return (
          <Suspense fallback={<LoadingPage />}>
            <SessionRetratoFalado />
          </Suspense>
        );
      case GAME_COLLECTION.SONHOS_PESADELOS:
        return (
          <Suspense fallback={<LoadingPage />}>
            <SessionSonhosPesadelos />
          </Suspense>
        );
      case GAME_COLLECTION.SUPER_CAMPEONATO:
        return (
          <Suspense fallback={<LoadingPage />}>
            <SessionSuperCampeonato />
          </Suspense>
        );
      case GAME_COLLECTION.TA_NA_CARA:
        return (
          <Suspense fallback={<LoadingPage />}>
            <SessionTaNaCara />
          </Suspense>
        );
      case GAME_COLLECTION.TESTEMUNHA_OCULAR:
        return (
          <Suspense fallback={<LoadingPage />}>
            <SessionTestemunhaOcular />
          </Suspense>
        );
      case GAME_COLLECTION.TREVO_DA_SORTE:
        return (
          <Suspense fallback={<LoadingPage />}>
            <SessionTrevoDaSorte />
          </Suspense>
        );
      case GAME_COLLECTION.UE_SO_ISSO:
        return (
          <Suspense fallback={<LoadingPage />}>
            <SessionUeSoIsso />
          </Suspense>
        );
      case GAME_COLLECTION.VAMOS_AO_CINEMA:
        return (
          <Suspense fallback={<LoadingPage />}>
            <SessionVamosAoCinema />
          </Suspense>
        );
      case GAME_COLLECTION.VENDAVAL_DE_PALPITE:
        return (
          <Suspense fallback={<LoadingPage />}>
            <SessionVendavalDePalpite />
          </Suspense>
        );

      default:
        console.warn('Wrong game library provided');
    }
  }

  console.log('pageError', gameName, gameId);

  // If switch fails, it's an error
  return <PageError />;
}

export default Game;
