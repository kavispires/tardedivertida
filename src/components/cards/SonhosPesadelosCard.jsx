import { memo } from 'react';
import PropTypes from 'prop-types';
// Utils
import { getColorFromLetter } from '../../utils/helpers';
// Components
import { Card } from './index';

export const SonhosPesadelosCard = memo(function ({ clue, footer, header = 'X', previousClues = ['bola'] }) {
  return (
    <Card
      color={getColorFromLetter(header)}
      header={header}
      size="medium"
      footer={footer}
      className="s-clue-card"
      footerClassName="s-clue-card__footer"
    >
      {clue}
      <ul>
        {previousClues.map((pClue) => (
          <li className="s-clue-card__previous--clue">{pClue}</li>
        ))}
      </ul>
    </Card>
  );
});

SonhosPesadelosCard.propTypes = {
  clue: PropTypes.string.isRequired,
  footer: PropTypes.string,
  header: PropTypes.string,
  previousClues: PropTypes.array,
};
