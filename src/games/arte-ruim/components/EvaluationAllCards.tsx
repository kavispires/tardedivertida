import clsx from "clsx";
// Hooks
import { useDevFeatures } from "hooks/useDevFeatures";
// Utils
import { LETTERS } from "utils/constants";
import { getEntryId } from "utils/helpers";
// Internal
import type { ArteRuimCard } from "../utils/types";
import { ArteRuimCard as Card } from "./Card";

type EvaluationAllCardsProps = {
  cards: ArteRuimCard[];
  activeItem: string;
  onActivateItem: GenericFunction;
  votes: PlainObject;
  levelType: string;
};

export function EvaluationAllCards({
  cards,
  activeItem,
  onActivateItem,
  votes,
  levelType,
}: EvaluationAllCardsProps) {
  const { isDebugEnabled } = useDevFeatures();
  const liButtonBaseClass = "a-evaluation-all-cards__li-card-button";

  return (
    <ul className="a-evaluation-all-cards">
      {cards.map((cardEntry, index) => {
        const letter = LETTERS[index];
        const cardEntryId = getEntryId(["card", cardEntry.id, letter]);
        const isActive = activeItem === cardEntryId;
        const isUsed = Object.values(votes).includes(cardEntryId);

        return (
          <li
            role="button"
            key={cardEntryId}
            className={clsx(
              liButtonBaseClass,
              isActive && `${liButtonBaseClass}--active`,
              isUsed && levelType !== "pairs" && `${liButtonBaseClass}--used`,
            )}
            onClick={() => onActivateItem(cardEntryId)}
          >
            <Card
              text={cardEntry.text}
              level={cardEntry.level}
              header={isDebugEnabled ? cardEntry.id : letter}
            />
          </li>
        );
      })}
    </ul>
  );
}
