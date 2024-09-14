// Components
import { DualTranslate, Translate } from 'components/language';
import { Instruction } from 'components/text';

type LevelInstructionProps = {
  level: number;
  levelType: string;
};

export function LevelInstruction({ level, levelType }: LevelInstructionProps) {
  if (level < 4) {
    return <></>;
  }

  if (level === 4) {
    return (
      <Instruction contained>
        <Translate
          pt="No nível 4, as cartas tem um ou dois temas comuns, então preste atenção nos detalhes"
          en="On level 4, the cards have one or two common themes, so pay attention to details"
        />
      </Instruction>
    );
  }

  if (levelType === 'pairs') {
    return (
      <Instruction contained>
        <Translate
          pt="No nível 5, só existem duas cartas para todos"
          en="On level 5, players draw one of two things only"
        />
      </Instruction>
    );
  }

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
