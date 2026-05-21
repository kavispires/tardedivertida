// Ant Design Resources
import { Flex } from 'antd';
// Components
import { ItemSprite } from 'components/cards/ItemCard';
import { DualTranslate } from 'components/language/DualTranslate';
import { Translate } from 'components/language/Translate';
// Internal
import type { ButtonEntry } from '../utils/types';

type ButtonContentProps = {
  /**
   * The button configuration from BUTTONS_DICT
   */
  button: ButtonEntry;
  /**
   *
   */
  pressCount: number;
};

/**
 * Renders the content inside a button based on its type
 */
export function ButtonContent({ button, pressCount }: ButtonContentProps) {
  // Switch based on button key to render different content types
  switch (button.key) {
    case 'BASIC_PRESS':
    case 'RED_BUTTON':
    case 'YELLOW_BUTTON':
      return (
        <ContentTextLabel>
          <Translate
            en="Press"
            pt="Aperte"
          />
        </ContentTextLabel>
      );

    case 'BASIC_DO_NOT_PRESS':
    case 'BLUE_BUTTON':
      return (
        <ContentTextLabel>
          <Translate
            en="Do Not Press"
            pt="Não Aperte"
          />
        </ContentTextLabel>
      );

    case 'FINAL_PRESS':
      return (
        <ContentTextLabel>
          <Translate
            en="Press To Win!"
            pt="Aperte para Vencer!"
          />
        </ContentTextLabel>
      );

    case 'PRESS_IF_WANTED':
      return (
        <ContentTextLabel>
          <Translate
            en="Press if you want to"
            pt="Aperte se você quiser"
          />
        </ContentTextLabel>
      );

    case 'SAME_AS_PREVIOUS':
      return (
        <ContentTextLabel>
          <Translate
            en="Same as Previous"
            pt="A mesma coisa que o anterior"
          />
        </ContentTextLabel>
      );

    case 'TRICK_POLITE_DO_NOT_PRESS':
      return (
        <ContentTextLabel>
          <Translate
            en="Please do not press"
            pt="Por favor, não aperte"
          />
        </ContentTextLabel>
      );

    case 'QUICK_DO_NOT_PRESS':
      return (
        <ContentTextLabel>
          <Translate
            en={
              <>
                Quickly!
                <br />
                Do not press
              </>
            }
            pt={
              <>
                Rápido!
                <br />
                Não aperte
              </>
            }
          />
        </ContentTextLabel>
      );

    case 'LOGIC_HUMAN_TRUE':
      return (
        <ContentTextLabel>
          <Translate
            en="Press if you are a human"
            pt="Aperte se você for humano"
          />
        </ContentTextLabel>
      );
    case 'LOGIC_HUMAN_FALSE':
      return (
        <ContentTextLabel>
          <Translate
            en="Press if you are not a human."
            pt="Aperte se você não for humano."
          />
        </ContentTextLabel>
      );

    case 'LOGIC_ROBOT_TRUE':
      return (
        <ContentTextLabel>
          <Translate
            en="Press if you are a robot"
            pt="Aperte se você for um robô"
          />
        </ContentTextLabel>
      );

    case 'LOGIC_ROBOT_FALSE':
      return (
        <ContentTextLabel>
          <Translate
            en="Press if you are not a robot"
            pt="Aperte se você não for um robô"
          />
        </ContentTextLabel>
      );

    case 'COUNT_SENTENCE':
    case 'RANDOM_QUESTION':
      return (
        <ContentTextSentence>
          <DualTranslate>{button.pool?.text || 'No sentence provided.'}</DualTranslate>
        </ContentTextSentence>
      );

    case 'PRESS_LESS':
      return (
        <ContentTextSentence>
          <Translate
            en={`Press less than ${button.targetCount} times`}
            pt={`Aperte menos de ${button.targetCount} vezes`}
          />
        </ContentTextSentence>
      );

    case 'PRESS_MORE':
      return (
        <ContentTextSentence>
          <Translate
            en={`Press more than ${button.targetCount} times`}
            pt={`Aperte mais de ${button.targetCount} vezes`}
          />
        </ContentTextSentence>
      );

    case 'PRESS_SHAPE_SIDE':
      return (
        <ContentTextSentence>
          <Translate
            en="Press for each side of the shape"
            pt="Aperte para cada lado da forma"
          />
          <ContentSequence>
            <ItemSprite
              itemId={button.pool?.itemId ?? '0'}
              width={64}
              className="button-item-sprite"
            />
          </ContentSequence>
        </ContentTextSentence>
      );

    case 'PRESS_SHAPE_CORNER':
      return (
        <ContentTextSentence>
          <Translate
            en="Press for each corner of the shape"
            pt="Aperte para cada canto da forma"
          />
          <ContentSequence>
            <ItemSprite
              itemId={button.pool?.itemId ?? '0'}
              width={64}
              className="button-item-sprite"
            />
          </ContentSequence>
        </ContentTextSentence>
      );

    case 'PRESS_TARGET_NUMBER':
      return (
        <ContentTextLabel>
          <DualTranslate>{button.pool?.text || 'No sentence provided.'}</DualTranslate>
        </ContentTextLabel>
      );

    case 'PRESS_TARGET_COUNTDOWN':
      return (
        <ContentTextLabel>
          <Translate
            en={`${button.targetCount - pressCount} presses remaining`}
            pt={`Faltam ${button.targetCount - pressCount} apertadas`}
          />
        </ContentTextLabel>
      );

    case 'DO_NOT_PRESS_RED_RULE':
      return (
        <ContentTextLabel>
          <Translate
            en="Never press when the button is red"
            pt="Nunca aperte quando o botão estiver vermelho"
          />
        </ContentTextLabel>
      );

    case 'REMEMBER_NUMBER': {
      return (
        <ContentTextLabel>
          <Translate
            en="Remember this number:"
            pt="Lembre-se deste número:"
          />
          <br />
          <ContentValue>{button.pool?.value ?? 'N/A'}</ContentValue>
        </ContentTextLabel>
      );
    }

    case 'REMEMBERED_NUMBER': {
      return (
        <ContentTextSentence>
          <Translate
            en="Press if the number you were supposed to remember is:"
            pt="Aperte se o número que você deveria lembrar é:"
          />
          <br />
          <ContentValue>{button.pool?.value ?? 'N/A'}</ContentValue>
        </ContentTextSentence>
      );
    }

    case 'COUNT_VOWELS': {
      return (
        <ContentTextSentence>
          <Translate
            en="Press for each vowel in this word:"
            pt="Aperte para cada vogal nesta palavra:"
          />
          <br />
          <ContentValue>{button.pool?.value ?? 'N/A'}</ContentValue>
        </ContentTextSentence>
      );
    }

    case 'COUNT_CONSONANTS': {
      return (
        <ContentTextSentence>
          <Translate
            en="Press for each consonant in this word:"
            pt="Aperte para cada consoante nesta palavra:"
          />
          <br />
          <ContentValue>{button.pool?.value ?? 'N/A'}</ContentValue>
        </ContentTextSentence>
      );
    }

    case 'EQUATION_RESULT': {
      return (
        <ContentTextSentence>
          <Translate
            en="Press the number the equation equals:"
            pt="Aperte o número que a equação resulta:"
          />
          <br />
          <ContentValue>{button.pool?.value ?? 'N/A'}</ContentValue>
        </ContentTextSentence>
      );
    }

    case 'ALL_ODD_NUMBERS': {
      return (
        <ContentTextSentence>
          <Translate
            en="Press if all numbers are odd:"
            pt="Aperte se todos os números forem ímpares:"
          />
          <br />
          <ContentValue>{button.pool?.value ?? 'N/A'}</ContentValue>
        </ContentTextSentence>
      );
    }
    case 'ALL_EVEN_NUMBERS': {
      return (
        <ContentTextSentence>
          <Translate
            en="Press if all numbers are even:"
            pt="Aperte se todos os números forem pares:"
          />
          <br />
          <ContentValue>{button.pool?.value ?? 'N/A'}</ContentValue>
        </ContentTextSentence>
      );
    }
    case 'WHEN_YOU_SEE_RULE': {
      return (
        <ContentTextSentence>
          <Translate
            en="Sempre press when you see this icon"
            pt="Sempre aperte quando você vir este ícone"
          />
          <br />
          <ContentSequence>
            <ItemSprite
              itemId={button.pool?.itemId ?? '0'}
              width={72}
            />
          </ContentSequence>
        </ContentTextSentence>
      );
    }

    case 'SEE_SOMETHING_PRESS': {
      return (
        <ContentTextLabel>
          <ContentSequence>
            <ItemSprite
              itemId={button.pool?.itemId ?? '0'}
              width={84}
            />
          </ContentSequence>
        </ContentTextLabel>
      );
    }

    case 'SEE_SOMETHING_PRESS_TRICK': {
      return (
        <ContentTextLabel>
          <Translate
            en="Do not press"
            pt="Não aperte"
          />
          <br />
          <ContentSequence>
            <ItemSprite
              itemId={button.pool?.itemId ?? '0'}
              width={24}
            />
          </ContentSequence>
        </ContentTextLabel>
      );
    }

    case 'SEE_SOMETHING_PRESS_ASIDE': {
      return (
        <ContentTextLabel>
          <Translate
            en="Do not press"
            pt="Não aperte"
          />

          <ItemSprite
            itemId={button.pool?.itemId ?? '0'}
            width={24}
            className="button-item-sprite-aside"
          />
        </ContentTextLabel>
      );
    }

    case 'WHEN_YOU_SEE_RULE_AVOID': {
      return (
        <ContentTextSentence>
          <Translate
            en="Never press when you see this icon"
            pt="Nunca aperte quando você vir este ícone"
          />
          <br />
          <ContentSequence>
            <ItemSprite
              itemId={button.pool?.itemId ?? '0'}
              width={72}
            />
          </ContentSequence>
        </ContentTextSentence>
      );
    }

    case 'SEE_SOMETHING_PRESS_AVOID': {
      return (
        <ContentTextLabel>
          <Translate
            en="Press"
            pt="Aperte"
          />
          <br />
          <ContentSequence>
            <ItemSprite
              itemId={button.pool?.itemId ?? '0'}
              width={36}
            />
          </ContentSequence>
        </ContentTextLabel>
      );
    }

    case 'SEE_AND_COUNT': {
      return (
        <ContentTextSentence>
          <Translate
            en="Press as many times as the icon appears"
            pt="Aperte tantas vezes quantas vezes o ícone aparecer"
          />
          <br />
          <ContentSequence>
            {new Array(button.targetCount).fill('').map((_, index) => (
              <ItemSprite
                key={index}
                itemId={button.pool?.itemId ?? '0'}
                width={32}
              />
            ))}
          </ContentSequence>
        </ContentTextSentence>
      );
    }

    case 'REMEMBER_SEQUENCE': {
      return (
        <ContentTextSentence>
          <Translate
            en="Remember this sequence, it's yours"
            pt="Lembre-se desta sequência, ela é sua"
          />
          <br />
          <ContentSequence>
            {button?.pool?.itemsIds.map((itemId: string, index: number) => (
              <ItemSprite
                key={index}
                itemId={itemId ?? '0'}
                width={32}
              />
            ))}
          </ContentSequence>
        </ContentTextSentence>
      );
    }

    case 'REMEMBERED_SEQUENCE': {
      return (
        <ContentTextSentence>
          <Translate
            en="Press if this is your sequence"
            pt="Aperte se esta é a sua sequência"
          />
          <br />
          <ContentSequence>
            {button?.pool?.itemsIds.map((itemId: string, index: number) => (
              <ItemSprite
                key={index}
                itemId={itemId ?? '0'}
                width={32}
              />
            ))}
          </ContentSequence>
        </ContentTextSentence>
      );
    }

    case 'ICON_COMPARISON': {
      return (
        <ContentTextSentence>
          <Translate
            en={
              <>
                Press if <DualTranslate>{button.pool?.value}</DualTranslate> appears more than any other icon
              </>
            }
            pt={
              <>
                Aperte se <DualTranslate>{button.pool?.value}</DualTranslate> aparecer mais do que qualquer
                outro ícone
              </>
            }
          />
          <br />
          <ContentSequence>
            {button?.pool?.itemsIds.map((itemId: string, index: number) => (
              <ItemSprite
                key={index}
                itemId={itemId ?? '0'}
                width={32}
              />
            ))}
          </ContentSequence>
        </ContentTextSentence>
      );
    }

    case 'MISSING_NUMBER': {
      return (
        <ContentTextSentence>
          <Translate
            en="Press as many times as the missing number in the sequence"
            pt="Aperte tantas vezes quanto o número que falta na sequência"
          />
          <br />
          <ContentValue>{button.pool?.value ?? 'N/A'}</ContentValue>
        </ContentTextSentence>
      );
    }
    case 'COUNT_SPECIFIC_LETTER': {
      return (
        <ContentTextSentence>
          <Translate
            en={<>Press as many times as the letter "{button.pool?.letter}" appears</>}
            pt={<>Aperte tantas vezes quanto a letra "{button.pool?.letter}" aparecer</>}
          />
          <br />
          <ContentValue>{button.pool?.value ?? 'N/A'}</ContentValue>
        </ContentTextSentence>
      );
    }
    case 'ALPHABET_POSITION': {
      return (
        <ContentTextSentence>
          <Translate
            en={<>Press as many times as the position of the letter "{button.pool?.value}" in the alphabet</>}
            pt={<>Aperte tantas vezes quanto a posição da letra "{button.pool?.value}" no alfabeto</>}
          />
        </ContentTextSentence>
      );
    }
    case 'ROMAN_NUMERALS': {
      return (
        <ContentTextSentence>
          <Translate
            en="Press as many times as the value of this Roman numeral"
            pt="Aperte tantas vezes quanto o valor deste numeral romano"
          />
          <br />
          <ContentValue>{button.pool?.value ?? 'N/A'}</ContentValue>
        </ContentTextSentence>
      );
    }
    case 'COUNT_ANIMAL_LEGS': {
      return (
        <ContentTextSentence>
          <Translate
            en="Press as many times as the total number of legs these animals have"
            pt="Aperte tantas vezes quanto o número total de pernas que esses animais têm"
          />
          <br />
          <ContentSequence>
            {button?.pool?.itemsIds.map((itemId: string, index: number) => (
              <ItemSprite
                key={index}
                itemId={itemId ?? '0'}
                width={48}
              />
            ))}
          </ContentSequence>
        </ContentTextSentence>
      );
    }
    case 'NUMBER_RIDDLE': {
      return (
        <ContentTextSentence>
          <Translate
            en="Press as many times as "
            pt="Aperte tantas vezes quanto "
          />
          <DualTranslate>{button.pool?.text}</DualTranslate>
        </ContentTextSentence>
      );
    }

    // Placeholder for other button types
    default:
      return (
        <div className="button-content">
          <div className="button-content__text">{button.key}</div>
        </div>
      );
  }
}

function ContentTextLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="button-content">
      <div className="button-content__label">{children}</div>
    </div>
  );
}

function ContentTextSentence({ children }: { children: React.ReactNode }) {
  return (
    <div className="button-content">
      <div className="button-content__sentence">{children}</div>
    </div>
  );
}

function ContentValue({ children }: { children: React.ReactNode }) {
  return <div className="button-content__value">{children}</div>;
}

function ContentSequence({ children }: { children: React.ReactNode }) {
  return (
    <Flex
      justify="center"
      className="mt-4"
      gap={8}
    >
      {children}
    </Flex>
  );
}
