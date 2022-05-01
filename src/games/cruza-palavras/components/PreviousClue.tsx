type PreviousClueProps = {
  clue: string;
};

export function PreviousClue({ clue }: PreviousClueProps) {
  return <div className="x-previous-clue">{clue}</div>;
}
