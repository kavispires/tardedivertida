// Types
import type { GroupQuestionCardData as GroupQuestionCardType } from 'types/tdr';
// Sass
import styles from './GroupQuestionCard.module.scss';

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

/**
 * Displays a group question card with question number and prefix/suffix text
 */
export function GroupQuestionCard({ question, overrideNumber }: GroupQuestionCardProps) {
  return (
    <span className={`${styles.groupQuestionCard} ${styles.groupQuestionCardSpan}`}>
      <span className={styles.groupQuestionCardPrefix}>{question.prefix}</span>
      <span className={styles.groupQuestionCardNumber}>{overrideNumber ?? question.number}</span>
      <span className={styles.groupQuestionCardSuffix}>{question.suffix}</span>
    </span>
  );
}
