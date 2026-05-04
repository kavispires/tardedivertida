// Internal
import * as AQUI_O from '../games/AquiO/utils/helpers';
import * as ARTE_RUIM from '../games/ArteRuim/utils/helpers';
import * as ALIENADO from '../games/Alienado/utils/helpers';
import * as ESTOQUISTA from '../games/Estoquista/utils/helpers';
import * as INVESTIGACAO from '../games/Investigacao/utils/helpers';
import * as FILMACO from '../games/Filmaco/utils/helpers';
import * as ORGANIKU from '../games/Organiku/utils/helpers';
import * as PALAVREADO from '../games/Palavreado/utils/helpers';
import * as PICACO from '../games/Picaco/utils/helpers';
import * as PORTAIS from '../games/Portais/utils/helpers';
import * as QUARTETOS from '../games/Quartetos/utils/helpers';
import * as CONJUNTOS from '../games/Conjuntos/utils/helpers';
import * as TA_NA_CARA from '../games/TaNaCara/utils/helpers';
import * as VITRAL from '../games/Vitral/utils/helpers';

export const ALL_HELPERS = {
  ALIENADO,
  AQUI_O,
  ARTE_RUIM,
  ARTISTA: PICACO, // Backwards compatibility
  COMUNICACAO_ALIENIGENA: ALIENADO, // Backwards compatibility
  CONJUNTOS,
  CONTROLE_DE_ESTOQUE: ESTOQUISTA, // Backwards compatibility
  ESPIONAGEM: INVESTIGACAO, // Backwards compatibility
  ESTOQUISTA,
  INVESTIGACAO,
  FILMACO,
  ORGANIKU,
  PALAVREADO,
  PICACO,
  PORTAIS,
  PORTAIS_MAGICOS: PORTAIS, // Backwards compatibility
  QUARTETOS,
  TEORIA_DE_CONJUNTOS: CONJUNTOS, // Backwards compatibility
  TA_NA_CARA,
  VITRAL,
  VITRAIS: VITRAL, // Backwards compatibility
};
