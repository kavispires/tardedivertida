// Hooks
import { useLanguage } from '@hooks/useLanguage';

export function Notes() {
  const { translate } = useLanguage();
  return (
    <textarea
      name=""
      id=""
      cols={30}
      rows={10}
      className="e-notes"
      placeholder={translate({
        pt: 'Escreva anotações aqui se quiser, mas cuidado com o teclado fazendo muito barulho',
        en: "Write your notes here, but don't make too much noise with those key strokes",
      })}
    />
  );
}
