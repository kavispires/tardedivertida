import { orderBy } from 'lodash';
import { Attribute, SignKey } from './types';

export const ATTRIBUTES = {
  alive: { id: 'alive', name: { en: 'Alive', pt: 'Vivo' } },
  beautiful: { id: 'beautiful', name: { en: 'Beautiful', pt: 'Bonito' } },
  big: { id: 'big', name: { en: 'Big', pt: 'Grande' } },
  bright: { id: 'bright', name: { en: 'Bright', pt: 'Brilho' } },
  clothes: { id: 'clothes', name: { en: 'Clothes', pt: 'Vestimenta' } },
  danger: { id: 'danger', name: { en: 'Danger', pt: 'Perigo' } },
  defense: { id: 'defense', name: { en: 'Defense', pt: 'Defesa' } },
  fast: { id: 'fast', name: { en: 'Fast', pt: 'Rápido' } },
  flat: { id: 'flat', name: { en: 'Flat', pt: 'Plano' } }, // New
  flight: { id: 'flight', name: { en: 'Flight', pt: 'Vôo' } },
  food: { id: 'food', name: { en: 'Food', pt: 'Comida' } },
  heavy: { id: 'heavy', name: { en: 'Heavy', pt: 'Pesado' } },
  human: { id: 'human', name: { en: 'Human', pt: 'Humano' } },
  knowledge: { id: 'knowledge', name: { en: 'Knowledge', pt: 'Conhecimento' } },
  liquid: { id: 'liquid', name: { en: 'Liquid', pt: 'Líquido' } },
  long: { id: 'long', name: { en: 'Long', pt: 'Longo' } },
  machine: { id: 'machine', name: { en: 'Machine', pt: 'Máquina' } }, // New
  metal: { id: 'metal', name: { en: 'Metal', pt: 'Metal' } },
  odor: { id: 'odor', name: { en: 'Odor', pt: 'Cheiro' } }, // New
  old: { id: 'old', name: { en: 'Old', pt: 'Velho' } }, // New
  plant: { id: 'plant', name: { en: 'Plant', pt: 'Planta' } },
  power: { id: 'power', name: { en: 'Power', pt: 'Força' } },
  round: { id: 'round', name: { en: 'Round', pt: 'Redondo' } },
  sharp: { id: 'sharp', name: { en: 'Sharp', pt: 'Afiado' } },
  // singular: { id: 'singular', name: { en: 'Singular', pt: 'Singular' } }, // deprecated
  soft: { id: 'soft', name: { en: 'Soft', pt: 'Mole' } }, // Newer
  solid: { id: 'solid', name: { en: 'Solid', pt: 'Sólido' } }, // Newer
  sound: { id: 'sound', name: { en: 'Sound', pt: 'Som' } }, // New
  tool: { id: 'tool', name: { en: 'Tool', pt: 'Ferramenta' } },
  valuable: { id: 'valuable', name: { en: 'Valuable', pt: 'Valioso' } },
  warm: { id: 'warm', name: { en: 'Warm', pt: 'Quente' } },
  weapon: { id: 'weapon', name: { en: 'Weapon', pt: 'Arma' } },
  // hard: { id: 'hard', name: { en: 'Hard', pt: 'Duro' } }, // deprecated
  holdable: { id: 'holdable', name: { en: 'Holdable', pt: 'Segurável' } }, // Newest
  personal: { id: 'personal', name: { en: 'Personal', pt: 'Pessoal' } }, // Newest
  multiple: { id: 'multiple', name: { en: 'Multiple', pt: 'Múltiplo' } }, // Newest
  fragile: { id: 'fragile', name: { en: 'Fragile', pt: 'Frágil' } }, // Newest
};

export const FIRST_ID = '1';
export const LAST_ID = '500';

export const SORTED_ATTRIBUTES = orderBy(Object.values(ATTRIBUTES), ['name.en'], ['asc']);

export const ATTRIBUTE_SIGN_DICT = SORTED_ATTRIBUTES.reduce(
  (acc: Record<string, SignKey>, attribute, index) => {
    acc[attribute.id] = String(index);
    return acc;
  },
  {}
);

export const SIGN_ATTRIBUTE_DICT = SORTED_ATTRIBUTES.reduce(
  (acc: Record<string, Attribute>, attribute, index) => {
    acc[index] = attribute.id as Attribute;
    return acc;
  },
  {}
);

export const SIGNS: Sign[] = SORTED_ATTRIBUTES.map((attribute, index) => ({
  key: attribute.id,
  attribute: attribute.name,
  signId: String(index),
}));
