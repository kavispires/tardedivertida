// Hooks
import { useLanguage } from '../../hooks';

export function Notes() {
  const { translate } = useLanguage();
  return (
    <textarea
      name=""
      id=""
      cols={30}
      rows={10}
      className="e-notes"
      placeholder={translate(
        'Escreva anotações aqui se quiser, mas cuidado com o teclado fazendo muito barulho',
        "Write your notes here, but don't make too much noise with those key strokes"
      )}
    />
  );
}
