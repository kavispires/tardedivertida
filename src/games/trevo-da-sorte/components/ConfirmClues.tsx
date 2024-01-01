// Types
import type { Leaves, CloverObject } from '../utils/types';
// Utils
import { parseRotation } from '../utils/helpers';
// Components
import { Translate } from 'components/language';
import { TextHighlight } from 'components/text';

type ConfirmCluesProps = {
  clover: CloverObject;
  leaves: Leaves;
  clues: string[];
  rotations: NumberDictionary;
};

export function ConfirmClues({ clover, leaves, clues, rotations }: ConfirmCluesProps) {
  const words = getWords(clover, leaves, rotations);

  return (
    <>
      <Translate
        pt="Tem certeza que quer enviar as seguintes dicas?"
        en="Are you sure you want to submit the following clues?"
      />

      <ul>
        {words.map((pair, index) => (
          <li key={`${pair[0]}-${pair[1]}`}>
            <TextHighlight>{pair[0]}</TextHighlight>+ <TextHighlight>{pair[1]}</TextHighlight> ={' '}
            <TextHighlight>{clues[index]}</TextHighlight>
          </li>
        ))}
      </ul>
    </>
  );
}

const getWords = (clover: CloverObject, leaves: Leaves, rotations: NumberDictionary) => {
  const leafA = leaves[clover.leaves.A.leafId];
  const leafARotation = parseRotation(rotations[leafA.id]);
  const leafB = leaves[clover.leaves.B.leafId];
  const leafBRotation = parseRotation(rotations[leafB.id]);
  const leafC = leaves[clover.leaves.C.leafId];
  const leafCRotation = parseRotation(rotations[leafC.id]);
  const leafD = leaves[clover.leaves.D.leafId];
  const leafDRotation = parseRotation(rotations[leafD.id]);

  const indexes: Record<number, number> = {
    0: 0,
    90: 3,
    180: 2,
    270: 1,
  };

  const getIndex = (rotationData: number, addition = 0) => {
    return (indexes[rotationData % 360] + addition) % 4;
  };

  return [
    [leafA.cards[getIndex(leafARotation)].text, leafB.cards[getIndex(leafBRotation)].text],
    [leafB.cards[getIndex(leafBRotation, 1)].text, leafC.cards[getIndex(leafCRotation, 1)].text],
    [leafC.cards[getIndex(leafCRotation, 2)].text, leafD.cards[getIndex(leafDRotation, 2)].text],
    [leafD.cards[getIndex(leafDRotation, 3)].text, leafA.cards[getIndex(leafARotation, 3)].text],
  ];
};
