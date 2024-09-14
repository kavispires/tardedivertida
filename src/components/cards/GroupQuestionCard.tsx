// Types
import type { GroupQuestionCard as GroupQuestionCardType } from 'types/tdr';
// Sass
import './GroupQuestionCard.scss';
// Type

type GroupQuestionCardProps = {
  /**
   * The question to be displayed
   */
  question: GroupQuestionCardType;
  /**
   * The number to be displayed. If not provided, the question's number will be used.
   */
  overrideNumber?: number;
};

export function GroupQuestionCard({ question, overrideNumber }: GroupQuestionCardProps) {
  return (
    <span className="group-question-card group-question-card--span">
      <span className="group-question-card__prefix">{question.prefix}</span>
      <span className="group-question-card__number">{overrideNumber ?? question.number}</span>
      <span className="group-question-card__suffix">{question.suffix}</span>
    </span>
  );
}
