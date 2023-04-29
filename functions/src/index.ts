import * as functions from 'firebase-functions';
// eslint-disable-next-line
import { initializeApp } from 'firebase-admin/app';
import * as commonEngine from './engine/common';
import * as adminEngine from './engine/admin';
import * as arteRuimEngine from './engine/arte-ruim';
import * as comunicacaoAlienigenaEngine from './engine/comunicacao-alienigena';
import * as contadoresHistoriasEngine from './engine/contadores-historias';
import * as crimesHediondosEngine from './engine/crimes-hediondos';
import * as cruzaPalavrasEngine from './engine/cruza-palavras';
import * as detetivesImaginativosEngine from './engine/detetives-imaginativos';
import * as espiaoEntreNosEngine from './engine/espiao-entre-nos';
import * as galeriaDeSonhosEngine from './engine/galeria-de-sonhos';
import * as linhasCruzadasEngine from './engine/linhas-cruzadas';
import * as megamixEngine from './engine/megamix';
import * as menteColetivaEngine from './engine/mente-coletiva';
import * as naRuaDoMedoEngine from './engine/na-rua-do-medo';
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
import * as trevoDaSorteEngine from './engine/trevo-da-sorte';
import * as ueSoIssoEngine from './engine/ue-so-isso';
import * as vamosAoCinemaEngine from './engine/vamos-ao-cinema';
import * as vendavalDePalpiteEngine from './engine/vendaval-de-palpite';
// Emulator
import { feedEmulatorDB } from './utils/mocks/emulator';

initializeApp();

if (process.env.FUNCTIONS_EMULATOR && process.env.FIRESTORE_EMULATOR_HOST) {
  feedEmulatorDB();
}

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

// ADMIN HTTP CALLS (require auth)

/**
 * Create a new game instance returning its meta data with gameId
 */
exports.createGame = functions.https.onCall(adminEngine.createGame);

/**
 * Lock game so new players cannot join
 */
exports.lockGame = functions.https.onCall(adminEngine.lockGame);

/**
 * Collection of admin actions like `nextPhase`, `playAgain`, `endGame`, etc
 */
exports.performAdminAction = functions.https.onCall(adminEngine.performAdminAction);

// COMMON HTTP CALLS

/**
 * Load an existing game
 */
exports.loadGame = functions.https.onCall(commonEngine.loadGame);

/**
 * Add player to the game, if it's an existing player, only return its state
 */
exports.addPlayer = functions.https.onCall(commonEngine.addPlayer);

/**
 * Make player ready and go to next game phase if all players are ready
 */
exports.makePlayerReady = functions.https.onCall(commonEngine.makePlayerReady);

/**
 * Rate game
 */
exports.rateGame = functions.https.onCall(commonEngine.rateGame);

/**
 * Load user
 */
exports.getUser = functions.https.onCall(commonEngine.getUser);

/**
 * Submit Actions
 */

exports.arteRuimSubmitAction = functions.https.onCall(arteRuimEngine.submitAction);

exports.contadoresHistoriasSubmitAction = functions.https.onCall(contadoresHistoriasEngine.submitAction);

exports.comunicacaoAlienigenaSubmitAction = functions.https.onCall(comunicacaoAlienigenaEngine.submitAction);

exports.crimesHediondosSubmitAction = functions.https.onCall(crimesHediondosEngine.submitAction);

exports.cruzaPalavrasSubmitAction = functions.https.onCall(cruzaPalavrasEngine.submitAction);

exports.detetivesImaginativosSubmitAction = functions.https.onCall(detetivesImaginativosEngine.submitAction);

exports.espiaoEntreNosSubmitAction = functions.https.onCall(espiaoEntreNosEngine.submitAction);

exports.galeriaDeSonhosSubmitAction = functions.https.onCall(galeriaDeSonhosEngine.submitAction);

exports.linhasCruzadasSubmitAction = functions.https.onCall(linhasCruzadasEngine.submitAction);

exports.megamixSubmitAction = functions.https.onCall(megamixEngine.submitAction);

exports.menteColetivaSubmitAction = functions.https.onCall(menteColetivaEngine.submitAction);

exports.naRuaDoMedoSubmitAction = functions.https.onCall(naRuaDoMedoEngine.submitAction);

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

exports.trevoDaSorteSubmitAction = functions.https.onCall(trevoDaSorteEngine.submitAction);

exports.ueSoIssoSubmitAction = functions.https.onCall(ueSoIssoEngine.submitAction);

exports.vamosAoCinemaSubmitAction = functions.https.onCall(vamosAoCinemaEngine.submitAction);

exports.vendavalDePalpiteSubmitAction = functions.https.onCall(vendavalDePalpiteEngine.submitAction);
