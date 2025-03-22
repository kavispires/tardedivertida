export const FOFOCA_QUENTE_ACTIONS = {
  SUBMIT_PLAYERS_ROLES: 'SUBMIT_PLAYERS_ROLES',
  SUBMIT_SOCIAL_GROUP: 'SUBMIT_SOCIAL_GROUP',
  SUBMIT_INTIMIDATION: 'SUBMIT_INTIMIDATION',
  SUBMIT_RUMOR: 'SUBMIT_RUMOR',
  SUBMIT_SKIP_RUMOR: 'SUBMIT_SKIP_RUMOR',
  SUBMIT_RESPONSE: 'SUBMIT_RESPONSE',
  UPDATE_DETECTIVE_POSITION: 'UPDATE_DETECTIVE_POSITION',
  UPDATE_STUDENT_POSITION: 'MOVE_STUDENTS',
  // TODO: do I need more specific?
  SUBMIT_INVESTIGATION: 'SUBMIT_INVESTIGATION',
};

export const AGE_NUMBER: NumberDictionary = {
  junior: 15,
  sophomore: 16,
  senior: 17,
};

export const HEIGHT: Dictionary<DualLanguageValue> = {
  short: {
    en: 'Short',
    pt: 'Baixa',
  },
  medium: {
    en: 'Medium',
    pt: 'Média',
  },
  tall: {
    en: 'Tall',
    pt: 'Alta',
  },
};

export const BUILD: Dictionary<DualLanguageValue> = {
  small: {
    en: 'Small',
    pt: 'Pequeno',
  },
  medium: {
    en: 'Medium',
    pt: 'Mediano',
  },
  large: {
    en: 'Large',
    pt: 'Grande',
  },
};

export const GENDER: Dictionary<DualLanguageValue> = {
  female: {
    en: 'Female',
    pt: 'Feminino',
  },
  male: {
    en: 'Male',
    pt: 'Masculino',
  },
  both: {
    en: 'Non-binary',
    pt: 'Não-binário',
  },
};

export const ACTION_TYPES = {
  INTIMIDATE: 'INTIMIDATE',
  RUMOR: 'RUMOR',
};
