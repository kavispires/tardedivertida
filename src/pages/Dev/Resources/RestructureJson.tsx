import { Button, Divider, Row, Spin } from 'antd';
import { TextAreaResult } from './RestructureComponents';
import {
  DATA_CARD_STORY_EN,
  DATA_CARD_STORY_PT,
  DATA_DRAWINGS,
  DATA_IMAGE_CARD_STORY_EN,
  DATA_IMAGE_CARD_STORY_PT,
  GAMES,
  GLOBAL_USED_ALIEN_ITEMS,
  GLOBAL_USED_ARTE_RUIM_CARDS,
  GLOBAL_USED_IMAGE_CARDS,
  GLOBAL_USED_OBJECTS,
  GLOBAL_USED_GAME_IDS,
  META,
  USERS,
  parseArteRuimGames,
  parseComunicacaoAlienigenaGames,
  parseContadoresHistoria,
  parseCrimesHediondos,
  parseCruzaPalavras,
  parseDetetivesImaginativos,
  parseEspiaoEntreNos,
  parseGaleriaDeSonhos,
  parseLinhasCruzadas,
  parseMegamix,
  parseMenteColetiva,
  parseNaRuaDoMedo,
  parseOndaTelepatica,
  GLOBAL_USED_OPPOSING_IDEAS,
  DATA_OPPOSING_IDEAS_CLUES,
  parsePolemicaDaVez,
  parsePortaDosDesesperados,
  parseQuemSouEu,
  DATA_CONTENDER_GLYPHS,
  GLOBAL_USED_CONTENDERS,
  DATA_MONSTER_DRAWINGS,
  GLOBAL_USED_MONSTERS,
  parseRetratoFalado,
  parseSonhosPesadelos,
  SKIPPED_GAMES,
  parseSuperCampeonato,
  GLOBAL_USED_CHALLENGES,
  GLOBAL_USED_SUSPECTS,
  GLOBAL_USED_MOVIES_AND_REVIEWS,
  DATA_SUSPECT_ANSWERS,
  parseTaNaCara,
  GLOBAL_USED_TESTIMONY_QUESTIONS,
  parseTestemunhaOcular,
  parseUeSoIsso,
  GLOBAL_USED_SINGLE_WORDS,
  parseVamosAoCinema,
  parseVendavalDePalpite,
  GLOBAL_USED_QUESTIONS,
} from './restructure-new';
import { useToggle } from 'react-use';
import { COLLECTIONS, getRestructureState } from './restructure-state';
import { useBackupJson, useParseGame } from './restructure-hooks';
import { useEffect } from 'react';

export function RestructureJson() {
  const [reload, toggle] = useToggle(true);

  useEffect(() => {
    if (!reload) {
      const timer = setTimeout(() => {
        toggle(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [reload]); // eslint-disable-line

  // Load Meta
  const { isLoading: metaLoading, data: metas } = useBackupJson(COLLECTIONS.META, true);
  // Load and parse Arte Ruim
  const { isLoading: arteRuimLoading } = useParseGame(
    COLLECTIONS.ARTE_RUIM,
    getRestructureState('LOAD_CHECK_LIST')[COLLECTIONS.META],
    parseArteRuimGames,
    metas
  );

  const { isLoading: comunicacaoAlienigenaLoading } = useParseGame(
    COLLECTIONS.COMUNICACAO_ALIENIGENA,
    getRestructureState('LOAD_CHECK_LIST')[COLLECTIONS.ARTE_RUIM],
    parseComunicacaoAlienigenaGames,
    metas
  );

  const { isLoading: contadoresHistoriasLoading } = useParseGame(
    COLLECTIONS.CONTADORES_HISTORIAS,
    getRestructureState('LOAD_CHECK_LIST')[COLLECTIONS.COMUNICACAO_ALIENIGENA],
    parseContadoresHistoria,
    metas
  );

  const { isLoading: crimesHediondosLoading } = useParseGame(
    COLLECTIONS.CRIMES_HEDIONDOS,
    getRestructureState('LOAD_CHECK_LIST')[COLLECTIONS.CONTADORES_HISTORIAS],
    parseCrimesHediondos,
    metas
  );

  const { isLoading: cruzaPalavrasLoading } = useParseGame(
    COLLECTIONS.CRUZA_PALAVRAS,
    getRestructureState('LOAD_CHECK_LIST')[COLLECTIONS.CRIMES_HEDIONDOS],
    parseCruzaPalavras,
    metas
  );

  const { isLoading: detetivesImaginativosLoading } = useParseGame(
    COLLECTIONS.DETETIVES_IMAGINATIVOS,
    getRestructureState('LOAD_CHECK_LIST')[COLLECTIONS.CRUZA_PALAVRAS],
    parseDetetivesImaginativos,
    metas
  );

  const { isLoading: espiaoEntreNosLoading } = useParseGame(
    COLLECTIONS.ESPIAO_ENTRE_NOS,
    getRestructureState('LOAD_CHECK_LIST')[COLLECTIONS.DETETIVES_IMAGINATIVOS],
    parseEspiaoEntreNos,
    metas
  );

  const { isLoading: galeriaDeSonhosLoading } = useParseGame(
    COLLECTIONS.GALERIA_DE_SONHOS,
    getRestructureState('LOAD_CHECK_LIST')[COLLECTIONS.ESPIAO_ENTRE_NOS],
    parseGaleriaDeSonhos,
    metas
  );

  const { isLoading: linhasCruzadasLoading } = useParseGame(
    COLLECTIONS.LINHAS_CRUZADAS,
    getRestructureState('LOAD_CHECK_LIST')[COLLECTIONS.GALERIA_DE_SONHOS],
    parseLinhasCruzadas,
    metas
  );

  const { isLoading: megamixLoading } = useParseGame(
    COLLECTIONS.MEGAMIX,
    getRestructureState('LOAD_CHECK_LIST')[COLLECTIONS.LINHAS_CRUZADAS],
    parseMegamix,
    metas
  );

  const { isLoading: menteColetivaLoading } = useParseGame(
    COLLECTIONS.MENTE_COLETIVA,
    getRestructureState('LOAD_CHECK_LIST')[COLLECTIONS.MEGAMIX],
    parseMenteColetiva,
    metas
  );

  const { isLoading: naRuaDoMedoLoading } = useParseGame(
    COLLECTIONS.NA_RUA_DO_MEDO,
    getRestructureState('LOAD_CHECK_LIST')[COLLECTIONS.MENTE_COLETIVA],
    parseNaRuaDoMedo,
    metas
  );

  const { isLoading: ondaTelepaticaLoading } = useParseGame(
    COLLECTIONS.ONDA_TELEPATICA,
    getRestructureState('LOAD_CHECK_LIST')[COLLECTIONS.NA_RUA_DO_MEDO],
    parseOndaTelepatica,
    metas
  );

  const { isLoading: polemicaDaVezLoading } = useParseGame(
    COLLECTIONS.POLEMICA_DA_VEZ,
    getRestructureState('LOAD_CHECK_LIST')[COLLECTIONS.ONDA_TELEPATICA],
    parsePolemicaDaVez,
    metas
  );

  const { isLoading: portaDosDesesperadosLoading } = useParseGame(
    COLLECTIONS.PORTA_DOS_DESESPERADOS,
    getRestructureState('LOAD_CHECK_LIST')[COLLECTIONS.POLEMICA_DA_VEZ],
    parsePortaDosDesesperados,
    metas
  );

  const { isLoading: quemSouEuLoading } = useParseGame(
    COLLECTIONS.QUEM_SOU_EU,
    getRestructureState('LOAD_CHECK_LIST')[COLLECTIONS.PORTA_DOS_DESESPERADOS],
    parseQuemSouEu,
    metas
  );

  const { isLoading: retratoFaladoLoading } = useParseGame(
    COLLECTIONS.RETRATO_FALADO,
    getRestructureState('LOAD_CHECK_LIST')[COLLECTIONS.QUEM_SOU_EU],
    parseRetratoFalado,
    metas
  );

  const { isLoading: sonhosPesadelosLoading } = useParseGame(
    COLLECTIONS.SONHOS_PESADELOS,
    getRestructureState('LOAD_CHECK_LIST')[COLLECTIONS.RETRATO_FALADO],
    parseSonhosPesadelos,
    metas
  );

  const { isLoading: superCampeonatoLoading } = useParseGame(
    COLLECTIONS.SUPER_CAMPEONATO,
    getRestructureState('LOAD_CHECK_LIST')[COLLECTIONS.SONHOS_PESADELOS],
    parseSuperCampeonato,
    metas
  );

  const { isLoading: taNaCaraLoading } = useParseGame(
    COLLECTIONS.TA_NA_CARA,
    getRestructureState('LOAD_CHECK_LIST')[COLLECTIONS.SUPER_CAMPEONATO],
    parseTaNaCara,
    metas
  );

  const { isLoading: testemunhaOcularLoading } = useParseGame(
    COLLECTIONS.TESTEMUNHA_OCULAR,
    getRestructureState('LOAD_CHECK_LIST')[COLLECTIONS.TA_NA_CARA],
    parseTestemunhaOcular,
    metas
  );

  const { isLoading: ueSoIssoLoading } = useParseGame(
    COLLECTIONS.UE_SO_ISSO,
    getRestructureState('LOAD_CHECK_LIST')[COLLECTIONS.TESTEMUNHA_OCULAR],
    parseUeSoIsso,
    metas
  );

  const { isLoading: vamosAoCinemaLoading } = useParseGame(
    COLLECTIONS.VAMOS_AO_CINEMA,
    getRestructureState('LOAD_CHECK_LIST')[COLLECTIONS.UE_SO_ISSO],
    parseVamosAoCinema,
    metas
  );

  const { isLoading: vendavalDePalpiteLoading } = useParseGame(
    COLLECTIONS.VENDAVAL_DE_PALPITE,
    getRestructureState('LOAD_CHECK_LIST')[COLLECTIONS.VAMOS_AO_CINEMA],
    parseVendavalDePalpite,
    metas
  );

  const { isLoading: usersLoading, data } = useParseGame(
    COLLECTIONS.USERS,
    getRestructureState('LOAD_CHECK_LIST')[COLLECTIONS.VENDAVAL_DE_PALPITE],
    () => console.log(Object.keys(USERS)),
    metas
  );

  if (getRestructureState('DONE_CHECK_LIST')[COLLECTIONS.VENDAVAL_DE_PALPITE]) {
    console.log({ userIds: Object.keys(USERS) });
  }

  const isLoading = [
    metaLoading,
    arteRuimLoading,
    comunicacaoAlienigenaLoading,
    contadoresHistoriasLoading,
    crimesHediondosLoading,
    cruzaPalavrasLoading,
    detetivesImaginativosLoading,
    espiaoEntreNosLoading,
    galeriaDeSonhosLoading,
    linhasCruzadasLoading,
    megamixLoading,
    menteColetivaLoading,
    naRuaDoMedoLoading,
    ondaTelepaticaLoading,
    polemicaDaVezLoading,
    portaDosDesesperadosLoading,
    quemSouEuLoading,
    retratoFaladoLoading,
    sonhosPesadelosLoading,
    superCampeonatoLoading,
    taNaCaraLoading,
    testemunhaOcularLoading,
    ueSoIssoLoading,
    vamosAoCinemaLoading,
    vendavalDePalpiteLoading,
    usersLoading,
  ].some(Boolean);

  const isDone = Object.values(getRestructureState('DONE_CHECK_LIST')).some(Boolean);

  return (
    <div>
      {isLoading && <Spin />}
      <Row gutter={[16, 16]}>
        <TextAreaResult name="metas" data={metas} isLoading={metaLoading} xs={12} />
        <TextAreaResult name="Latest" data={data} isLoading={isLoading} xs={6} />
        <TextAreaResult name="UserIds" data={Object.keys(USERS).sort()} isLoading={isLoading} xs={6} />
      </Row>

      <Divider />
      <h1>
        Finalized Data{' '}
        <Button onClick={toggle} size="small">
          Reload {!reload && 'OFF'}
        </Button>
      </h1>

      {isLoading && <Spin />}
      {!isLoading && reload && (
        <Row gutter={[16, 16]} key={`is-it-${isDone}`}>
          <TextAreaResult name="META" data={META} />

          <TextAreaResult name="GLOBAL_USED_GAME_IDS" data={GLOBAL_USED_GAME_IDS} />

          <TextAreaResult name="USERS" data={USERS} />

          <TextAreaResult name="GAMES" data={GAMES} />

          <TextAreaResult name="GLOBAL_USED_ARTE_RUIM_CARDS" data={GLOBAL_USED_ARTE_RUIM_CARDS} />

          <TextAreaResult name="GLOBAL_USED_IMAGE_CARDS" data={GLOBAL_USED_IMAGE_CARDS} />

          <TextAreaResult name="GLOBAL_USED_ALIEN_ITEMS" data={GLOBAL_USED_ALIEN_ITEMS} />

          <TextAreaResult name="GLOBAL_USED_OBJECTS" data={GLOBAL_USED_OBJECTS} />

          <TextAreaResult name="GLOBAL_USED_OPPOSING_IDEAS" data={GLOBAL_USED_OPPOSING_IDEAS} />

          <TextAreaResult name="GLOBAL_USED_CONTENDERS" data={GLOBAL_USED_CONTENDERS} />

          <TextAreaResult name="GLOBAL_USED_MONSTERS" data={GLOBAL_USED_MONSTERS} />

          <TextAreaResult name="GLOBAL_USED_CHALLENGES" data={GLOBAL_USED_CHALLENGES} />

          <TextAreaResult name="GLOBAL_USED_SUSPECTS" data={GLOBAL_USED_SUSPECTS} />

          <TextAreaResult name="GLOBAL_USED_QUESTIONS" data={GLOBAL_USED_QUESTIONS} />

          <TextAreaResult name="GLOBAL_USED_TESTIMONY_QUESTIONS" data={GLOBAL_USED_TESTIMONY_QUESTIONS} />

          <TextAreaResult name="GLOBAL_USED_MOVIES_AND_REVIEWS" data={GLOBAL_USED_MOVIES_AND_REVIEWS} />

          <TextAreaResult name="GLOBAL_USED_SINGLE_WORDS" data={GLOBAL_USED_SINGLE_WORDS} />

          <TextAreaResult name="DATA_DRAWINGS" data={DATA_DRAWINGS} />

          <TextAreaResult name="DATA_MONSTER_DRAWINGS" data={DATA_MONSTER_DRAWINGS} />

          <TextAreaResult name="DATA_IMAGE_CARD_STORY_PT" data={DATA_IMAGE_CARD_STORY_PT} />

          <TextAreaResult name="DATA_IMAGE_CARD_STORY_EN" data={DATA_IMAGE_CARD_STORY_EN} />

          <TextAreaResult name="DATA_CARD_STORY_PT" data={DATA_CARD_STORY_PT} />

          <TextAreaResult name="DATA_CARD_STORY_EN" data={DATA_CARD_STORY_EN} />

          <TextAreaResult name="DATA_OPPOSING_IDEAS_CLUES" data={DATA_OPPOSING_IDEAS_CLUES} />

          <TextAreaResult name="DATA_CONTENDER_GLYPHS" data={DATA_CONTENDER_GLYPHS} />

          <TextAreaResult name="DATA_SUSPECT_ANSWERS" data={DATA_SUSPECT_ANSWERS} />

          <TextAreaResult name="SKIPPED_GAMES" data={Object.keys(SKIPPED_GAMES)} />
        </Row>
      )}
    </div>
  );
}
