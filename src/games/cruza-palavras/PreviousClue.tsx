type PreviousClueProps = {
  clue: string;
};

function PreviousClue({ clue }: PreviousClueProps) {
  return <div className="x-previous-clue">{clue}</div>;
}

export default PreviousClue;
