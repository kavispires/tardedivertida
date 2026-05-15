// Internal
import { SETTINGS as ALIENADO } from '../games/Alienado/utils/settings';
import { SETTINGS as AQUI_O } from '../games/AquiO/utils/settings';
import { SETTINGS as ARTE_RUIM } from '../games/ArteRuim/utils/settings';
import { SETTINGS as CONEXOES } from '../games/Conexoes/utils/settings';
import { SETTINGS as CONJUNTOS } from '../games/Conjuntos/utils/settings';
import { SETTINGS as ENDLESS_VITRAIS } from '../games/VitraisInfinitos/utils/settings';
import { SETTINGS as ESTOQUISTA } from '../games/Estoquista/utils/settings';
import { SETTINGS as FILMACO } from '../games/Filmaco/utils/settings';
import { SETTINGS as INVESTIGACAO } from '../games/Investigacao/utils/settings';
import { SETTINGS as MAPEAMENTO } from '../games/Mapeamento/utils/settings';
import { SETTINGS as ORGANIKU } from '../games/Organiku/utils/settings';
import { SETTINGS as PALAVREADO } from '../games//Palavreado/utils/settings';
import { SETTINGS as PICACO } from '../games/Picaco/utils/settings';
import { SETTINGS as PORTAIS } from '../games/Portais/utils/settings';
import { SETTINGS as QUARTETOS } from '../games/Quartetos/utils/settings';
import { SETTINGS as VITRAL } from '../games/Vitral/utils/settings';
import { SETTINGS as TA_NA_CARA } from '../games/TaNaCara/utils/settings';

export const ALL_SETTINGS = {
  ALIENADO,
  AQUI_O,
  ARTE_RUIM,
  CONEXOES,
  CONJUNTOS,
  ESTOQUISTA,
  INVESTIGACAO,
  FILMACO,
  MAPEAMENTO,
  ORGANIKU,
  PALAVREADO,
  PICACO,
  PORTAIS,
  QUARTETOS,
  TA_NA_CARA,
  VITRAL,
  ENDLESS_VITRAIS,
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
