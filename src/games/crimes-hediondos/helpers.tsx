import { orderBy } from 'lodash';

type SplitWeaponsAndEvidence = {
  weapons: HCard[];
  evidences: HCard[];
};
export const splitWeaponsAndEvidence = (items: ItemsDict, language: Language): SplitWeaponsAndEvidence => {
  const { weapons, evidences } = Object.values(items).reduce(
    (acc: PlainObject, item) => {
      if (item.type === 'weapon') {
        acc.weapons.push(item);
      } else {
        acc.evidences.push(item);
      }
      return acc;
    },
    {
      weapons: [],
      evidences: [],
    }
  );

  const sortedWeapons = orderBy(weapons, [`name.${language}`], ['asc']);
  const sortedEvidences = orderBy(evidences, [`name.${language}`], ['asc']);

  return {
    weapons: sortedWeapons,
    evidences: sortedEvidences,
  };
};
