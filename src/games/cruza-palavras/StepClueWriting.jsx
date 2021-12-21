import PropTypes from 'prop-types';
// Hooks
import { useLoading } from '../../hooks';
// Components
import { Instruction, Title, Translate } from '../../components/shared';
import WordGrid from './WordGrid';
import WritingCell from './WritingCell';

function StepClueWriting({ grid, user, onSubmitClue }) {
  const [isLoading] = useLoading();

  return (
    <div className="x-step">
      <Title>
        <Translate pt="Escreva sua dica" en="Write your clue" />
      </Title>

      <Instruction contained>
        <Translate
          pt="Clique no icone azul e escreva sua dica. Sua dica deve conter apenas uma palavra."
          en="Click on the blue icon and write your clue. Your clue must be a single word clue."
        />
      </Instruction>

      <WordGrid
        grid={grid}
        user={user}
        CellComponent={WritingCell}
        cellComponentProps={{ onSubmitClue, disabled: isLoading }}
      />
    </div>
  );
}

StepClueWriting.propTypes = {
  grid: PropTypes.any,
  onSubmitClue: PropTypes.func,
  user: PropTypes.any,
};

export default StepClueWriting;
