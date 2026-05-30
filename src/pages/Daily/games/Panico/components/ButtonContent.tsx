import clsx from 'clsx';
import { motion } from 'motion/react';
// Ant Design Resources
import { Flex } from 'antd';
// Components
import { ItemSprite } from 'components/cards/ItemCard';
import { WarehouseGoodSprite } from 'components/cards/WarehouseGoodCard';
import { DualTranslate } from 'components/language/DualTranslate';
import { Translate } from 'components/language/Translate';
// Internal
import type { ButtonEntry } from '../utils/types';

type ButtonContentProps = {
  /**
   * The button configuration from BUTTONS_LIBRARY
   */
  button: ButtonEntry;
  /**
   *
   */
  pressCount: number;
  /**
   *
   */
  buttonIndex: number;
};

/**
 * Renders the content inside a button based on its type
 */
export function ButtonContent({ button, pressCount, buttonIndex }: ButtonContentProps) {
  // Switch based on button key to render different content types
  switch (button.key) {
    // Group 1: Direct or tricky press instructions
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
    case 'PRESS_IF_WANTED':
      return (
        <ContentTextLabel>
          <Translate
            en="Press if you want to"
            pt="Aperte se você quiser"
          />
        </ContentTextLabel>
      );
    case 'FINAL_PRESS':
      return (
        <ContentTextLabel>
          <Translate
            en="Press Many Times To Win!"
            pt="Aperte várias vezes para ganhar!"
          />
        </ContentTextLabel>
      );
    case 'TRICK_URGENT_PRESS':
      return (
        <ContentTextLabel>
          <Translate
            en="Press immediately!"
            pt="Rápido! Aperte  imediatamente!"
          />
        </ContentTextLabel>
      );

    // Group 2: Direct do not press instructions
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

    // Group 3: Logic conditional buttons
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

    // Group 4: Variable count buttons
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

    // Group 5: Icon buttons with specific instructions
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
          <ContentValue>
            <Translate
              en={
                <>
                  Press <span className="button-unbreakable-value">{button.pool?.value ?? 'N/A'}</span> times
                </>
              }
              pt={
                <>
                  Aperte <span className="button-unbreakable-value">{button.pool?.value ?? 'N/A'}</span> vezes
                </>
              }
            />
          </ContentValue>
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
            pt={<>Aperte tantas vezes quanto a letra "{button.pool?.letter}" aparece</>}
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
        <ContentTextLabel>
          <Translate
            en={
              <>
                Press <i>{button.pool?.value ?? 'N/A'}</i> times
              </>
            }
            pt={
              <>
                Aperte <i>{button.pool?.value ?? 'N/A'}</i> vezes
              </>
            }
          />
        </ContentTextLabel>
      );
    }

    // Group X: Special button
    case 'SAME_AS_PREVIOUS':
      return (
        <ContentTextLabel>
          <Translate
            en="Same as Previous"
            pt="A mesma coisa que o anterior"
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

    case 'WHEN_YOU_SEE_RULE': {
      return (
        <ContentTextSentence>
          <Translate
            en="Sempre press when you see:"
            pt="Sempre aperte quando você vir:"
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
            en="Never press when you see"
            pt="Nunca aperte quando você vir"
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
            en="Press as many times as this appears"
            pt="Aperte tantas vezes quantas vezes isto aparece"
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
                Press if <DualTranslate>{button.pool?.more}</DualTranslate> appear more than{' '}
                <DualTranslate>{button.pool?.less}</DualTranslate>
              </>
            }
            pt={
              <>
                Aperte se <DualTranslate>{button.pool?.more}</DualTranslate> aparecem mais vezes que{' '}
                <DualTranslate>{button.pool?.less}</DualTranslate>
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

    case 'COLOR_WORD_RULE': {
      return (
        <ContentTextSentence>
          <Translate
            en="Always press if the name is the same color as the word"
            pt="Sempre aperte se o nome estiver na mesma cor que a palavra"
          />
        </ContentTextSentence>
      );
    }

    case 'COLOR_WORD': {
      return (
        <ContentTextLabel>
          <span style={{ color: button.pool?.color ?? 'black' }}>
            <DualTranslate>{button.pool?.text}</DualTranslate>
          </span>
        </ContentTextLabel>
      );
    }

    case 'LONG_INSTRUCTION': {
      return (
        <ContentTextSentence>
          <DualTranslate>{button.pool?.text}</DualTranslate>
        </ContentTextSentence>
      );
    }

    case 'SPINNING_ICONS': {
      return (
        <motion.span
          className="button-content__spinning-icons"
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
        >
          {button?.pool?.decoyItemsIds.map((itemId: string, index: number) => {
            return (
              <motion.span
                key={index}
                animate={{ rotate: index % 3 === 0 ? 360 : -360 }}
                transition={{
                  duration: 2 + Math.random() * 3, // 2-5 seconds
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'linear',
                }}
              >
                <ItemSprite
                  itemId={itemId ?? '0'}
                  width={64}
                  className="spinning-icon"
                />
              </motion.span>
            );
          })}
        </motion.span>
      );
    }

    case 'COLOR_GRID': {
      return (
        <ContentTextSentence>
          <Translate
            en="Press if same color"
            pt="Aperte se a cor for a mesma"
          />
          <br />
          <div className="button-content__color-grid">
            {button?.pool?.itemsIds.map((itemId: string, index: number) => (
              <ItemSprite
                key={index}
                itemId={itemId ?? '0'}
                width={48}
              />
            ))}
          </div>
        </ContentTextSentence>
      );
    }

    case 'ALL_SAME_RULE': {
      return (
        <ContentTextSentence>
          <Translate
            en="Always press when green animals are all the same kind"
            pt="Sempre aperte quando todos os animais verdes forem do mesmo tipo"
          />
        </ContentTextSentence>
      );
    }

    case 'SEE_SAME_THINGS_PRESS': {
      return (
        <div className="button-content__animal-grid">
          {button?.pool?.goodsIds.map((itemId: string, index: number) => (
            <WarehouseGoodSprite
              key={index}
              goodId={itemId ?? '0'}
              width={28}
              className={clsx({ 'animal-sprite-inverted': (buttonIndex + index) % 7 === 0 })}
            />
          ))}
        </div>
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
