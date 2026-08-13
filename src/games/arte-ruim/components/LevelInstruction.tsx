// Components
import { DualTranslate } from '@components/language/DualTranslate';
import { Translate } from '@components/language/Translate';
import { TranslateTemplate } from '@components/language/TranslateTemplate';
import { Surface } from '@components/layout/Surface';

type LevelInstructionProps = {
  level: number;
  levelType: string;
};

export function LevelInstruction({ level, levelType }: LevelInstructionProps) {
  if (level < 4) {
    return null;
  }

  if (level === 4 && levelType === 'pairs') {
    return (
      <Surface contained>
        <Translate
          pt="No nível 4, só existem duas cartas para todos"
          en="On level 4, players draw one of two things only"
        />
      </Surface>
    );
  }

  if (level === 4) {
    return (
      <Surface contained>
        <TranslateTemplate
          en="Special round: {levelType}"
          pt="Rodada especial: {levelType}"
          values={{
            levelType: (
              <>
                <DualTranslate>{getLevelText[levelType] ?? { pt: 'Surpresa', en: 'Surprise' }}</DualTranslate>
              </>
            ),
          }}
        />
      </Surface>
    );
  }

  if (level === 5) {
    return (
      <Surface contained>
        <Translate
          pt="No nível 5, as cartas tem um ou dois temas comuns, então preste atenção nos detalhes"
          en="On level 5, the cards have one or two common themes, so pay attention to details"
        />
      </Surface>
    );
  }

  return null;
}

const getLevelText: Record<string, DualLanguageValue> = {
  contenders: {
    pt: 'Personagens e Personalidades',
    en: 'Characters and Celebrities',
  },
  movies: {
    pt: 'Filmes',
    en: 'Movies',
  },
  adjectives: {
    pt: 'Adjetivos',
    en: 'Adjectives',
  },
};
