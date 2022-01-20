// Utils
import { getColorFromLetter } from '../../utils/helpers';
import { Card } from '../../components';
// Components

type SonhosPesadelosCardProps = {
  clue: string;
  footer: string;
  header: string;
  previousClues: string[];
};

export function SonhosPesadelosCard({
  clue,
  footer,
  header = 'X',
  previousClues = ['bola'],
}: SonhosPesadelosCardProps) {
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
}
