// Internal
import { SETTINGS as AQUI_O } from '../games/AquiO/utils/settings';
import { SETTINGS as ARTE_RUIM } from '../games/ArteRuim/utils/settings';
import { SETTINGS as COMUNICACAO_ALIENIGENA } from '../games/ComunicacaoAlienigena/utils/settings';
import { SETTINGS as CONTROLE_DE_ESTOQUE } from '../games/ControleDeEstoque/utils/settings';
import { SETTINGS as ESPIONAGEM } from '../games/Espionagem/utils/settings';
import { SETTINGS as FILMACO } from '../games/Filmaco/utils/settings';
import { SETTINGS as ORGANIKU } from '../games/Organiku/utils/settings';
import { SETTINGS as PALAVREADO } from '../games//Palavreado/utils/settings';
import { SETTINGS as PICACO } from '../games/Picaco/utils/settings';
import { SETTINGS as PORTAIS_MAGICOS } from '../games/PortaisMagicos/utils/settings';
import { SETTINGS as QUARTETOS } from '../games/Quartetos/utils/settings';
import { SETTINGS as TEORIA_DE_CONJUNTOS } from '../games/TeoriaDeConjuntos/utils/settings';
import { SETTINGS as TA_NA_CARA } from '../games/TaNaCara/utils/settings';

export const ALL_SETTINGS = {
  AQUI_O,
  ARTE_RUIM,
  COMUNICACAO_ALIENIGENA,
  CONTROLE_DE_ESTOQUE,
  ESPIONAGEM,
  FILMACO,
  ORGANIKU,
  PALAVREADO,
  PICACO,
  PORTAIS_MAGICOS,
  QUARTETOS,
  TEORIA_DE_CONJUNTOS,
  TA_NA_CARA,
};

type GameKey = keyof typeof ALL_SETTINGS;

export const getSettings = (gameKey: string) => {
  // Convert game key from kebab-case to SNAKE_CASE
  const formattedGameKey = gameKey.toUpperCase().replace(/-/g, '_');
  const settings = ALL_SETTINGS[formattedGameKey as GameKey];

  if (!settings) {
    throw new Error(`Settings for game "${gameKey}" not found.`);
  }

  return settings;
};
