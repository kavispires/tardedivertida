// Constants
import { TDR_RESOURCES } from '../../utils/constants';
// Types
import type { ResourceData, SocialGroup, StaffMember } from './types';
// Utils
import * as resourceUtils from '../resource';
import type { TeenageMotivation, TeenageRumor, TeenageStudent } from '../../types/tdr';
import utils from '../../utils';
import { TOTAL_RUMORS, TOTAL_STUDENTS } from './constants';

/**
 * Get dilemmas resource based on the game's language
 * @param language
 * @returns
 */
export const getData = async (): Promise<ResourceData> => {
  // Get all teenagers
  const allTeenagers = await resourceUtils.fetchResource<Dictionary<TeenageStudent>>(
    TDR_RESOURCES.TEENAGE_STUDENTS,
  );
  const teenagers = utils.game.getRandomItems(Object.values(allTeenagers), TOTAL_STUDENTS);

  // Get rumors
  const allRumors = await resourceUtils.fetchResource<Dictionary<TeenageRumor>>(TDR_RESOURCES.TEENAGE_RUMORS);
  const rumors = utils.game.getRandomItems(Object.values(allRumors), TOTAL_RUMORS);

  // Get motivations
  const allMotivations = await resourceUtils.fetchResource<Dictionary<TeenageMotivation>>(
    TDR_RESOURCES.TEENAGE_MOTIVATIONS,
  );
  const motivations = Object.values(allMotivations);

  // Get locations
  const locations = LOCATIONS;

  // Get staff
  const staff = STAFF;

  // Build social groups
  const socialGroups = Object.keys(
    teenagers.reduce((acc: BooleanDictionary, student) => {
      acc[student.socialGroupId] = true;
      return acc;
    }, {}),
  ).reduce((acc, socialGroupId) => {
    acc[socialGroupId] = SOCIAL_GROUPS[socialGroupId];
    return acc;
  }, {});

  return {
    teenagers,
    rumors,
    motivations,
    socialGroups,
    locations,
    staff,
  };
};

const LOCATIONS = [
  {
    id: 'location-1',
    name: {
      en: 'Gymnasium',
      pt: 'Quadra',
    },
  },
  {
    id: 'location-2',
    name: {
      en: 'Locker Room',
      pt: 'Vestiário',
    },
  },
  {
    id: 'location-3',
    name: {
      // eslint-disable-next-line quotes
      en: "Guidance Counselor's Office",
      pt: 'Sala do Orientador',
    },
  },
  {
    id: 'location-4',
    name: {
      en: 'Computer Lab',
      pt: 'Laboratório de Informática',
    },
  },
  {
    id: 'location-5',
    name: {
      en: 'Swimming Pool',
      pt: 'Piscina',
    },
  },
  {
    id: 'location-6',
    name: {
      // eslint-disable-next-line quotes
      en: "Principal's Office",
      pt: 'Direção',
    },
  },
  {
    id: 'location-7',
    name: {
      en: 'Library',
      pt: 'Biblioteca',
    },
  },
  {
    id: 'location-8',
    name: {
      en: 'Cafeteria',
      pt: 'Lanchonete',
    },
  },
  {
    id: 'location-9',
    name: {
      // eslint-disable-next-line quotes
      en: "Teacher's Lounge",
      pt: 'Sala dos Professores',
    },
  },
  {
    id: 'location-10',
    name: {
      en: 'Art Studio',
      pt: 'Ateliê de Arte',
    },
  },
  {
    id: 'location-11',
    name: {
      en: 'Music Room',
      pt: 'Sala de Música',
    },
  },
  {
    id: 'location-12',
    name: {
      en: 'Classroom',
      pt: 'Sala de aula',
    },
  },
  {
    id: 'location-13',
    name: {
      // eslint-disable-next-line quotes
      en: "Nurse's Office",
      pt: 'Enfermaria',
    },
  },
  {
    id: 'location-14',
    name: {
      en: 'Science Lab',
      pt: 'Laboratório',
    },
  },
  {
    id: 'location-15',
    name: {
      en: 'Auditorium',
      pt: 'Auditório',
    },
  },
  {
    id: 'location-16',
    name: {
      en: 'Playground',
      pt: 'Parquinho',
    },
  },
];

const STAFF: Dictionary<StaffMember> = {
  'staff-1': {
    id: 'staff-1',
    type: 'monitor',
    name: {
      en: 'Principal',
      pt: 'Diretor',
    },
    description: {
      en: 'You may place monitoring token on a student in this location or any adjacent location.',
      pt: 'Você pode colocar um token de monitoramento em um aluno neste local ou em qualquer local adjacente.',
    },
    locationId: 'location-6',
    adjacentLocations: ['location-2', 'location-5', 'location-7', 'location-10'],
  },
  'staff-2': {
    id: 'staff-2',
    type: 'monitor',
    name: {
      en: 'Principal Assistant',
      pt: 'Assistente do Diretor',
    },
    description: {
      en: 'You may place monitoring token on a student in this location or any adjacent location.',
      pt: 'Você pode colocar um token de monitoramento em um aluno neste local ou em qualquer local adjacente.',
    },
    locationId: 'location-15',
  },
  'staff-3': {
    id: 'staff-3',
    type: 'question',
    name: {
      en: 'Lunch Lady',
      pt: 'Merendeira',
    },
    description: {
      en: 'You may question one unintimidated student in this location or any adjacent location.',
      pt: 'Você pode questionar um aluno não intimidado neste local ou em qualquer local adjacente.',
    },
    locationId: 'location-8',
    adjacentLocations: ['location-4', 'location-7', 'location-12'],
  },
  'staff-4': {
    id: 'staff-4',
    type: 'question',
    name: {
      en: 'Janitor',
      pt: 'Faxineiro',
    },
    description: {
      en: 'You may question one unintimidated student in this location or any adjacent location.',
      pt: 'Você pode questionar um aluno não intimidado neste local ou em qualquer local adjacente.',
    },
    locationId: 'location-10',
    adjacentLocations: ['location-6', 'location-9', 'location-11'],
  },
  'staff-5': {
    id: 'staff-5',
    type: 'comfort',
    name: {
      en: 'Counselor',
      pt: 'Orientador',
    },
    description: {
      en: 'You may comfort one intimidated student in this location or any adjacent location.',
      pt: 'Você pode confortar um aluno não intimidado neste local ou em qualquer local adjacente.',
    },
    locationId: 'location-3',
    adjacentLocations: ['location-2', 'location-4', 'location-7'],
  },
  'staff-6': {
    id: 'staff-6',
    type: 'comfort',
    name: {
      en: 'Nurse',
      pt: 'Enfermeira',
    },
    description: {
      en: 'You may comfort one intimidated student in this location or any adjacent location.',
      pt: 'Você pode confortar um aluno não intimidado neste local ou em qualquer local adjacente.',
    },
    locationId: 'location-13',
    adjacentLocations: ['location-9', 'location-14'],
  },
  'staff-7': {
    id: 'staff-7',
    type: 'gather',
    name: {
      en: 'PE Teacher',
      pt: 'Treinador',
    },
    description: {
      en: 'From a random social group, you may move every student in this social group once.',
      pt: 'De um grupo social aleatório, você pode mover todos os alunos deste grupo social uma vez.',
    },
    locationId: 'location-1',
  },
  'staff-8': {
    id: 'staff-8',
    type: 'gather',
    name: {
      en: 'Art Teacher',
      pt: 'Professora',
    },
    description: {
      en: 'From a random social group, you may move every student in this social group once.',
      pt: 'De um grupo social aleatório, você pode mover todos os alunos deste grupo social uma vez.',
    },
    locationId: 'location-12',
  },
};

const SOCIAL_GROUPS: Dictionary<SocialGroup> = {
  arts: {
    id: 'arts',
    name: {
      en: 'Arts',
      pt: 'Artes',
    },
    colors: {
      primary: '#e2be05',
      accent: '#746f04',
    },
  },
  immigrants: {
    id: 'immigrants',
    name: {
      en: 'Immigrants',
      pt: 'Imigrantes',
    },
    colors: {
      primary: '#532b23',
      accent: '#c4867a',
    },
  },
  'jet-set': {
    id: 'jet-set',
    name: {
      en: 'Jet Set',
      pt: 'Elite',
    },
    colors: {
      primary: '#f914e4',
      accent: '##f4e3f3',
    },
  },
  jocks: {
    id: 'jocks',
    name: {
      en: 'Jocks',
      pt: 'Atletas',
    },
    colors: {
      primary: '#fa2e45',
      accent: '#ffd9dd',
    },
  },
  leaders: {
    id: 'leaders',
    name: {
      en: 'Leaders',
      pt: 'Líderes',
    },
    colors: {
      primary: '#015aca',
      accent: '#7eb4f8',
    },
  },
  nerds: {
    id: 'nerds',
    name: {
      en: 'Nerds',
      pt: 'Nerds',
    },
    colors: {
      primary: '#01efb7',
      accent: '#064939',
    },
  },
  outcasts: {
    id: 'outcasts',
    name: {
      en: 'Outcasts',
      pt: 'Marginalizados',
    },
    colors: {
      primary: '#ff9743',
      accent: '#853d02',
    },
  },
  'special-needs': {
    id: 'special-needs',
    name: {
      en: 'Special Needs',
      pt: 'Necessidades Especiais',
    },
    colors: {
      primary: '#32c91e',
      accent: '#125908',
    },
  },
  troublemakers: {
    id: 'troublemakers',
    name: {
      en: 'Troublemakers',
      pt: 'Desordeiros',
    },
    colors: {
      primary: '#7746c8',
      accent: '#cdb1fa',
    },
  },
};
