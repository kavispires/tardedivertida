// Types
import type { GroupQuestionCard as GroupQuestionCardType } from 'types/tdr';
// Sass
import styles from './GroupQuestionCard.module.scss';
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
    <span className={`${styles.groupQuestionCard} ${styles.groupQuestionCardSpan}`}>
      <span className={styles.groupQuestionCardPrefix}>{question.prefix}</span>
      <span className={styles.groupQuestionCardNumber}>{overrideNumber ?? question.number}</span>
      <span className={styles.groupQuestionCardSuffix}>{question.suffix}</span>
    </span>
  );
}
