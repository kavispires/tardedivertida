import { lazy, Suspense } from 'react';
// Hooks
import { useGameMeta } from 'hooks/useGameMeta';
import { useIsGameStale } from 'hooks/useIsGameStale';
import { useLanguage } from 'hooks/useLanguage';
import { useLoading } from 'hooks/useLoading';
// Utils
import { GAME_COLLECTION } from 'utils/constants';
// Components
import { PageError } from 'components/errors';
import { LoadingPage } from 'components/loaders';

// Game lazy imports
const SessionAdedanhx = lazy(
  () => import('games/adedanhx/SessionAdedanhx' /* webpackChunkName: "adedanhx" */),
);
const SessionArteRuim = lazy(
  () => import('games/arte-ruim/SessionArteRuim' /* webpackChunkName: "arte-ruim" */),
);
const SessionComunicacaoAlienigena = lazy(
  () =>
    import(
      'games/comunicacao-alienigena/SessionComunicacaoAlienigena' /* webpackChunkName: "comunicacao-alienigena" */
    ),
);
const SessionComunicacaoDuo = lazy(
  () => import('games/comunicacao-duo/SessionComunicacaoDuo' /* webpackChunkName: "comunicacao-duo" */),
);
const SessionContadoresHistorias = lazy(
  () =>
    import(
      'games/contadores-historias/SessionContadoresHistorias' /* webpackChunkName: "contadores-historias" */
    ),
);
const SessionControleDeEstoque = lazy(
  () =>
    import(
      'games/controle-de-estoque/SessionControleDeEstoque' /* webpackChunkName: "controle-de-estoque" */
    ),
);
const SessionCrimesHediondos = lazy(
  () => import('games/crimes-hediondos/SessionCrimesHediondos' /* webpackChunkName: "crimes-hediondos" */),
);
const SessionCruzaPalavras = lazy(
  () => import('games/cruza-palavras/SessionCruzaPalavras' /* webpackChunkName: "cruza-palavras" */),
);
const SessionDetetivesImaginativos = lazy(
  () =>
    import(
      'games/detetives-imaginativos/SessionDetetivesImaginativos' /* webpackChunkName: "detetives-imaginativos" */
    ),
);
const SessionDuetos = lazy(() => import('games/duetos/SessionDuetos' /* webpackChunkName: "duetos" */));
const SessionEspiaoEntreNos = lazy(
  () => import('games/espiao-entre-nos/SessionEspiaoEntreNos' /* webpackChunkName: "espiao-entre-nos" */),
);
const SessionEsquiadores = lazy(
  () => import('games/esquiadores/SessionEsquiadores' /* webpackChunkName: "esquiadores" */),
);
const SessionFileiraDeFatos = lazy(
  () => import('games/fileira-de-fatos/SessionFileiraDeFatos' /* webpackChunkName: "fileira-de-fatos" */),
);
const SessionFofocaQuente = lazy(
  () => import('games/fofoca-quente/SessionFofocaQuente' /* webpackChunkName: "fofoca-quente" */),
);
const SessionGaleriaDeSonhos = lazy(
  () => import('games/galeria-de-sonhos/SessionGaleriaDeSonhos' /* webpackChunkName: "galeria-de-sonhos" */),
);
const SessionIdadeDaPreda = lazy(
  () => import('games/idade-da-preda/SessionIdadeDaPreda' /* webpackChunkName: "idade-da-preda" */),
);
const SessionLabirintoSecreto = lazy(
  () => import('games/labirinto-secreto/SessionLabirintoSecreto' /* webpackChunkName: "labirinto-secreto" */),
);
const SessionLinhasCruzadas = lazy(
  () => import('games/linhas-cruzadas/SessionLinhasCruzadas' /* webpackChunkName: "linhas-cruzadas" */),
);
const SessionMedidasNaoExatas = lazy(
  () =>
    import('games/medidas-nao-exatas/SessionMedidasNaoExatas' /* webpackChunkName: "medidas-nao-exatas" */),
);
const SessionMegamix = lazy(() => import('games/megamix/SessionMegamix' /* webpackChunkName: "megamix" */));
const SessionMenteColetiva = lazy(
  () => import('games/mente-coletiva/SessionMenteColetiva' /* webpackChunkName: "mente-coletiva" */),
);
const SessionMesmice = lazy(() => import('games/mesmice/SessionMesmice' /* webpackChunkName: "mesmice" */));
const SessionMetalinguagem = lazy(
  () => import('games/metalinguagem/SessionMetalinguagem' /* webpackChunkName: "metalinguagem" */),
);
const SessionNaRuaDoMedo = lazy(
  () => import('games/na-rua-do-medo/SessionNaRuaDoMedo' /* webpackChunkName: "na-rua-do-medo" */),
);
const SessionNaoSouRobo = lazy(
  () => import('games/nao-sou-robo/SessionNaoSouRobo' /* webpackChunkName: "nao-sou-robo" */),
);
const SessionOndaTelepatica = lazy(
  () => import('games/onda-telepatica/SessionOndaTelepatica' /* webpackChunkName: "onda-telepatica" */),
);
const SessionPlanejamentoUrbano = lazy(
  () =>
    import(
      'games/planejamento-urbano/SessionPlanejamentoUrbano' /* webpackChunkName: "planejamento-urbano" */
    ),
);
const SessionPolemicaDaVez = lazy(
  () => import('games/polemica-da-vez/SessionPolemicaDaVez' /* webpackChunkName: "polemica-da-vez" */),
);
const SessionPortaDosDesesperados = lazy(
  () =>
    import(
      'games/porta-dos-desesperados/SessionPortaDosDesesperados' /* webpackChunkName: "porta-dos-desesperados" */
    ),
);
const SessionQuemNaoMata = lazy(
  () => import('games/quem-nao-mata/SessionQuemNaoMata' /* webpackChunkName: "quem-nao-mata" */),
);
const SessionQuemSouEu = lazy(
  () => import('games/quem-sou-eu/SessionQuemSouEu' /* webpackChunkName: "quem-sou-eu" */),
);
const SessionRetratoFalado = lazy(
  () => import('games/retrato-falado/SessionRetratoFalado' /* webpackChunkName: "retrato-falado" */),
);
const SessionSinaisDeAlerta = lazy(
  () => import('games/sinais-de-alerta/SessionSinaisDeAlerta' /* webpackChunkName: "sinais-de-alerta" */),
);
const SessionSonhosPesadelos = lazy(
  () => import('games/sonhos-pesadelos/SessionSonhosPesadelos' /* webpackChunkName: "sonhos-pesadelos" */),
);
const SessionSuperCampeonato = lazy(
  () => import('games/super-campeonato/SessionSuperCampeonato' /* webpackChunkName: "super-campeonato" */),
);
const SessionTaNaCara = lazy(
  () => import('games/ta-na-cara/SessionTaNaCara' /* webpackChunkName: "ta-na-cara" */),
);
const SessionTeoriaDeConjuntos = lazy(
  () =>
    import(
      'games/teoria-de-conjuntos/SessionTeoriaDeConjuntos' /* webpackChunkName: "teoria-de-conjuntos" */
    ),
);
const SessionTestemunhaOcular = lazy(
  () => import('games/testemunha-ocular/SessionTestemunhaOcular' /* webpackChunkName: "testemunha-ocular" */),
);
const SessionTesteDeElenco = lazy(
  () => import('games/teste-de-elenco/SessionTesteDeElenco' /* webpackChunkName: "teste-de-elenco" */),
);
const SessionTrevoDaSorte = lazy(
  () => import('games/trevo-da-sorte/SessionTrevoDaSorte' /* webpackChunkName: "trevo-da-sorte" */),
);
const SessionUeSoIsso = lazy(
  () => import('games/ue-so-isso/SessionUeSoIsso' /* webpackChunkName: "ue-so-isso" */),
);
const SessionVamosAoCinema = lazy(
  () => import('games/vamos-ao-cinema/SessionVamosAoCinema' /* webpackChunkName: "vamos-ao-cinema" */),
);
const SessionVendavalDePalpite = lazy(
  () =>
    import(
      'games/vendaval-de-palpite/SessionVendavalDePalpite' /* webpackChunkName: "vendaval-de-palpite" */
    ),
);
const SessionViceCampeao = lazy(
  () => import('games/vice-campeao/SessionViceCampeao' /* webpackChunkName: "vice-campeao" */),
);

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
    switch (gameName) {
      case GAME_COLLECTION.ADEDANHX:
        return (
          <Suspense fallback={<LoadingPage />}>
            <SessionAdedanhx />
          </Suspense>
        );
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
      case GAME_COLLECTION.COMUNICACAO_DUO:
        return (
          <Suspense fallback={<LoadingPage />}>
            <SessionComunicacaoDuo />
          </Suspense>
        );
      case GAME_COLLECTION.CONTADORES_HISTORIAS:
        return (
          <Suspense fallback={<LoadingPage />}>
            <SessionContadoresHistorias />
          </Suspense>
        );
      case GAME_COLLECTION.CONTROLE_DE_ESTOQUE:
        return (
          <Suspense fallback={<LoadingPage />}>
            <SessionControleDeEstoque />
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
      case GAME_COLLECTION.DUETOS:
        return (
          <Suspense fallback={<LoadingPage />}>
            <SessionDuetos />
          </Suspense>
        );
      case GAME_COLLECTION.ESPIAO_ENTRE_NOS:
        return (
          <Suspense fallback={<LoadingPage />}>
            <SessionEspiaoEntreNos />
          </Suspense>
        );
      case GAME_COLLECTION.ESQUIADORES:
        return (
          <Suspense fallback={<LoadingPage />}>
            <SessionEsquiadores />
          </Suspense>
        );
      case GAME_COLLECTION.FILEIRA_DE_FATOS:
        return (
          <Suspense fallback={<LoadingPage />}>
            <SessionFileiraDeFatos />
          </Suspense>
        );
      case GAME_COLLECTION.FOFOCA_QUENTE:
        return (
          <Suspense fallback={<LoadingPage />}>
            <SessionFofocaQuente />
          </Suspense>
        );
      case GAME_COLLECTION.IDADE_DA_PREDA:
        return (
          <Suspense fallback={<LoadingPage />}>
            <SessionIdadeDaPreda />
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
      case GAME_COLLECTION.MEDIDAS_NAO_EXATAS:
        return (
          <Suspense fallback={<LoadingPage />}>
            <SessionMedidasNaoExatas />
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
      case GAME_COLLECTION.MESMICE:
        return (
          <Suspense fallback={<LoadingPage />}>
            <SessionMesmice />
          </Suspense>
        );
      case GAME_COLLECTION.METALINGUAGEM:
        return (
          <Suspense fallback={<LoadingPage />}>
            <SessionMetalinguagem />
          </Suspense>
        );
      case GAME_COLLECTION.NA_RUA_DO_MEDO:
        return (
          <Suspense fallback={<LoadingPage />}>
            <SessionNaRuaDoMedo />
          </Suspense>
        );
      case GAME_COLLECTION.NAO_SOU_ROBO:
        return (
          <Suspense fallback={<LoadingPage />}>
            <SessionNaoSouRobo />
          </Suspense>
        );
      case GAME_COLLECTION.ONDA_TELEPATICA:
        return (
          <Suspense fallback={<LoadingPage />}>
            <SessionOndaTelepatica />
          </Suspense>
        );
      case GAME_COLLECTION.PLANEJAMENTO_URBANO:
        return (
          <Suspense fallback={<LoadingPage />}>
            <SessionPlanejamentoUrbano />
          </Suspense>
        );
      case GAME_COLLECTION.POLEMICA_DA_VEZ:
        return (
          <Suspense fallback={<LoadingPage />}>
            <SessionPolemicaDaVez />
          </Suspense>
        );
      case GAME_COLLECTION.PORTA_DOS_DESESPERADOS:
        return (
          <Suspense fallback={<LoadingPage />}>
            <SessionPortaDosDesesperados />
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
      case GAME_COLLECTION.SINAIS_DE_ALERTA:
        return (
          <Suspense fallback={<LoadingPage />}>
            <SessionSinaisDeAlerta />
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
      case GAME_COLLECTION.TEORIA_DE_CONJUNTOS:
        return (
          <Suspense fallback={<LoadingPage />}>
            <SessionTeoriaDeConjuntos />
          </Suspense>
        );
      case GAME_COLLECTION.TESTEMUNHA_OCULAR:
        return (
          <Suspense fallback={<LoadingPage />}>
            <SessionTestemunhaOcular />
          </Suspense>
        );
      case GAME_COLLECTION.TESTE_DE_ELENCO:
        return (
          <Suspense fallback={<LoadingPage />}>
            <SessionTesteDeElenco />
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
      case GAME_COLLECTION.VICE_CAMPEAO:
        return (
          <Suspense fallback={<LoadingPage />}>
            <SessionViceCampeao />
          </Suspense>
        );

      default:
        // biome-ignore lint/suspicious/noConsole: on purpose
        console.warn('Wrong game library provided');
        return <PageError />;
    }
  }

  // If switch fails, it's an error
  return <PageError />;
}

export default Game;
