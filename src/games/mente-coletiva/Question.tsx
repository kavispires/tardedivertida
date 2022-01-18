type QuestionProps = {
  question: MQuestion;
};

export function Question({ question }: QuestionProps) {
  return (
    <span className="m-question m-question--span">
      <span className="m-question__prefix">{question.prefix}</span>
      <span className="m-question__number">{question.number}</span>
      <span className="m-question__suffix">{question.suffix}</span>
    </span>
  );
}
