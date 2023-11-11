import * as functions from 'firebase-functions';
// eslint-disable-next-line
import { initializeApp } from 'firebase-admin/app';
import * as commonEngine from './engine/common';
import * as adminEngine from './engine/admin';
import * as dailyEngine from './engine/daily';
import * as userEngine from './engine/user';

import * as adedanhxEngine from './engine/adedanhx';
import * as arteRuimEngine from './engine/arte-ruim';
import * as comunicacaoAlienigenaEngine from './engine/comunicacao-alienigena';
import * as contadoresHistoriasEngine from './engine/contadores-historias';
import * as crimesHediondosEngine from './engine/crimes-hediondos';
import * as cruzaPalavrasEngine from './engine/cruza-palavras';
import * as detetivesImaginativosEngine from './engine/detetives-imaginativos';
import * as duetosEngine from './engine/duetos';
import * as espiaoEntreNosEngine from './engine/espiao-entre-nos';
import * as fileiraDeFatosEngine from './engine/fileira-de-fatos';
import * as galeriaDeSonhosEngine from './engine/galeria-de-sonhos';
import * as labirintoSecretoEngine from './engine/labirinto-secreto';
import * as linhasCruzadasEngine from './engine/linhas-cruzadas';
import * as megamixEngine from './engine/megamix';
import * as menteColetivaEngine from './engine/mente-coletiva';
import * as naRuaDoMedoEngine from './engine/na-rua-do-medo';
import * as naoSouRoboEngine from './engine/nao-sou-robo';
import * as ondaTelepaticaEngine from './engine/onda-telepatica';
import * as polemicaDaVezEngine from './engine/polemica-da-vez';
import * as quemNaoMataEngine from './engine/quem-nao-mata';
import * as quemSouEuEngine from './engine/quem-sou-eu';
import * as portaDosDesesperadosEngine from './engine/porta-dos-desesperados';
import * as retratoFaladoEngine from './engine/retrato-falado';
import * as sonhosPesadelosEngine from './engine/sonhos-pesadelos';
import * as superCampeonatoEngine from './engine/super-campeonato';
import * as taNaCaraEngine from './engine/ta-na-cara';
import * as testemunhaOcularEngine from './engine/testemunha-ocular';
import * as testeDeElencoEngine from './engine/teste-de-elenco';
import * as trevoDaSorteEngine from './engine/trevo-da-sorte';
import * as ueSoIssoEngine from './engine/ue-so-isso';
import * as vamosAoCinemaEngine from './engine/vamos-ao-cinema';
import * as vendavalDePalpiteEngine from './engine/vendaval-de-palpite';

import { feedEmulatorUser } from './utils/mocks/emulator';

initializeApp();

if (process.env.FUNCTIONS_EMULATOR && process.env.FIRESTORE_EMULATOR_HOST) {
  feedEmulatorUser();
}

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

// ADMIN HTTP CALLS (require auth)

/**
 * Admin Actions
 * Create a new game instance returning its meta data with gameId
 * Lock game so new players cannot join
 */
exports.adminActions = functions.https.onCall(adminEngine.adminApi);

/**
 * Collection of admin actions like `nextPhase`, `playAgain`, `endGame`, etc
 */
exports.performAdminAction = functions.https.onCall(adminEngine.performAdminAction);

/**
 * Common game actions
 */
exports.gameActions = functions.https.onCall(commonEngine.gameApi);

/**
 * User actions
 */
exports.userActions = functions.https.onCall(userEngine.userApi);

/**
 * Daily actions
 */
exports.dailyActions = functions.https.onCall(dailyEngine.dailyApi);

// SUBMIT ACTIONS

exports.adedanhxSubmitAction = functions.https.onCall(adedanhxEngine.submitAction);

exports.arteRuimSubmitAction = functions.https.onCall(arteRuimEngine.submitAction);

exports.contadoresHistoriasSubmitAction = functions.https.onCall(contadoresHistoriasEngine.submitAction);

exports.comunicacaoAlienigenaSubmitAction = functions.https.onCall(comunicacaoAlienigenaEngine.submitAction);

exports.crimesHediondosSubmitAction = functions.https.onCall(crimesHediondosEngine.submitAction);

exports.cruzaPalavrasSubmitAction = functions.https.onCall(cruzaPalavrasEngine.submitAction);

exports.detetivesImaginativosSubmitAction = functions.https.onCall(detetivesImaginativosEngine.submitAction);

exports.duetosSubmitAction = functions.https.onCall(duetosEngine.submitAction);

exports.espiaoEntreNosSubmitAction = functions.https.onCall(espiaoEntreNosEngine.submitAction);

exports.fileiraDeFatosSubmitAction = functions.https.onCall(fileiraDeFatosEngine.submitAction);

exports.galeriaDeSonhosSubmitAction = functions.https.onCall(galeriaDeSonhosEngine.submitAction);

exports.labirintoSecretoSubmitAction = functions.https.onCall(labirintoSecretoEngine.submitAction);

exports.linhasCruzadasSubmitAction = functions.https.onCall(linhasCruzadasEngine.submitAction);

exports.megamixSubmitAction = functions.https.onCall(megamixEngine.submitAction);

exports.menteColetivaSubmitAction = functions.https.onCall(menteColetivaEngine.submitAction);

exports.naRuaDoMedoSubmitAction = functions.https.onCall(naRuaDoMedoEngine.submitAction);

exports.naoSouRoboSubmitAction = functions.https.onCall(naoSouRoboEngine.submitAction);

exports.ondaTelepaticaSubmitAction = functions.https.onCall(ondaTelepaticaEngine.submitAction);

exports.polemicaDaVezSubmitAction = functions.https.onCall(polemicaDaVezEngine.submitAction);

exports.portaDosDesesperadosSubmitAction = functions.https.onCall(portaDosDesesperadosEngine.submitAction);

exports.quemNaoMataSubmitAction = functions.https.onCall(quemNaoMataEngine.submitAction);

exports.quemSouEuSubmitAction = functions.https.onCall(quemSouEuEngine.submitAction);

exports.retratoFaladoSubmitAction = functions.https.onCall(retratoFaladoEngine.submitAction);

exports.sonhosPesadelosSubmitAction = functions.https.onCall(sonhosPesadelosEngine.submitAction);

exports.superCampeonatoSubmitAction = functions.https.onCall(superCampeonatoEngine.submitAction);

exports.taNaCaraSubmitAction = functions.https.onCall(taNaCaraEngine.submitAction);

exports.testemunhaOcularSubmitAction = functions.https.onCall(testemunhaOcularEngine.submitAction);

exports.testeDeElencoSubmitAction = functions.https.onCall(testeDeElencoEngine.submitAction);

exports.trevoDaSorteSubmitAction = functions.https.onCall(trevoDaSorteEngine.submitAction);

exports.ueSoIssoSubmitAction = functions.https.onCall(ueSoIssoEngine.submitAction);

exports.vamosAoCinemaSubmitAction = functions.https.onCall(vamosAoCinemaEngine.submitAction);

exports.vendavalDePalpiteSubmitAction = functions.https.onCall(vendavalDePalpiteEngine.submitAction);
