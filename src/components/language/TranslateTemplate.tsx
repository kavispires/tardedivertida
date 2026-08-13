import { Fragment, type ReactNode } from 'react';
// Ant Design Resources
import { App } from 'antd';
// Hooks
import { useLanguage } from '@hooks/useLanguage';

type TranslateTemplateProps = {
  /**
   * The template string in English (e.g., "{player} chose {target}")
   */
  en: string;
  /**
   * The template string in Portuguese (e.g., "{player} escolheu {target}")
   */
  pt: string;
  /**
   * A dictionary mapping the string placeholders to React nodes
   */
  values: Record<string, ReactNode>;
  /**
   * Optional custom content that overrides the `pt` and `en` props
   */
  custom?: ReactNode;
};

/**
 * Parses a string with {placeholders} and replaces them with React components.
 */
export function TranslateTemplate({ en, pt, values, custom }: TranslateTemplateProps) {
  const { message } = App.useApp();
  const { language } = useLanguage();

  if (!language) {
    const errorMessage = 'Could not reach the useLanguage hook';
    // biome-ignore lint/suspicious/noConsole: for debug purposes
    console.error(errorMessage);
    message.error(errorMessage);
    return <span>?</span>;
  }

  if (custom) {
    return <span>{custom}</span>;
  }

  if (!pt || !en) {
    const errorMessage = '`pt` or `en` translation was not provided';
    // biome-ignore lint/suspicious/noConsole: for debug purposes
    console.error(errorMessage);
    message.error(errorMessage);
    return <span>?</span>;
  }

  const text = language === 'pt' ? pt : en;

  // Splits the text by {key} while keeping the key in the array.
  // Example: "A {b} C" becomes ["A ", "b", " C"]
  const parts = text.split(/\{(\w+)\}/g);

  return (
    <span>
      {parts.map((part, index) => {
        // Odd indices are the captured placeholder keys from the regex
        if (index % 2 === 1) {
          const value = values[part];
          // If the key exists in our values object, render the ReactNode
          if (value !== undefined) {
            return <Fragment key={index}>{value}</Fragment>;
          }
          // Fallback if you accidentally use a {key} that isn't in `values`
          return <Fragment key={index}>{`{${part}}`}</Fragment>;
        }
        // Even indices are just standard text chunks
        return <Fragment key={index}>{part}</Fragment>;
      })}
    </span>
  );
}
