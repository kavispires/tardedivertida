// Components
import { DualTranslate } from 'components/language/DualTranslate';
import { Translate } from 'components/language/Translate';
import { Instruction } from 'components/text/Instruction';

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
      <Instruction contained>
        <Translate
          pt="No nível 4, só existem duas cartas para todos"
          en="On level 4, players draw one of two things only"
        />
      </Instruction>
    );
  }

  if (level === 4) {
    return (
      <Instruction contained>
        <Translate
          pt={
            <>
              Rodada Especial:{' '}
              <DualTranslate>{getLevelText[levelType] ?? { pt: 'Surpresa', en: 'Surprise' }}</DualTranslate>
            </>
          }
          en={<>Special Round: {}</>}
        />
      </Instruction>
    );
  }

  if (level === 5) {
    return (
      <Instruction contained>
        <Translate
          pt="No nível 5, as cartas tem um ou dois temas comuns, então preste atenção nos detalhes"
          en="On level 5, the cards have one or two common themes, so pay attention to details"
        />
      </Instruction>
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
