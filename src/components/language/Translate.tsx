import { Fragment, memo, type ReactNode } from 'react';
// Ant Design Resources
import { App } from 'antd';
// Hooks
import { useLanguage } from '@hooks/useLanguage';

type TranslateValue = ReactNode | ((content: string) => ReactNode);

type TranslateTemplateProps = {
  /**
   * The template string in English (e.g., "{player} chose <highlight>this</highlight>")
   */
  en: string;
  /**
   * The template string in Portuguese (e.g., "{player} escolheu <highlight>isto</highlight>")
   */
  pt: string;
  /**
   * A dictionary mapping the string placeholders or tags to React nodes / functions
   */
  values?: Record<string, TranslateValue>;
  /**
   * Optional custom content that overrides the `pt` and `en` props
   */
  custom?: ReactNode;
};

// Default HTML tag handlers so you don't have to pass them every time
const DEFAULT_VALUES: Record<string, TranslateValue> = {
  br: <br />,
  strong: (text: string) => <strong>{text}</strong>,
  b: (text: string) => <b>{text}</b>,
  i: (text: string) => <i>{text}</i>,
  u: (text: string) => <u>{text}</u>,
  em: (text: string) => <em>{text}</em>,
};

/**
 * Parses a string with {placeholders}, <wrapper>tags</wrapper>, and <selfClosing/> tags,
 * replacing them with React components.
 */
export const Translate = memo(function Translate({ en, pt, values = {}, custom }: TranslateTemplateProps) {
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
  const allValues = { ...DEFAULT_VALUES, ...values };

  // Regex matches: <tag>content</tag> OR <tag/> OR {var}
  const regex = /(<\w+>.*?<\/\w+>|<\w+\s*\/>|\{\w+\})/g;
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, index) => {
        // 1. Check for wrapper tags: <key>content</key>
        const tagMatch = part.match(/^<(\w+)>(.*?)<\/\1>$/);
        if (tagMatch) {
          const key = tagMatch[1];
          const content = tagMatch[2];
          const Wrapper = allValues[key];

          if (typeof Wrapper === 'function') {
            return <Fragment key={index}>{Wrapper(content)}</Fragment>;
          }
          return <Fragment key={index}>{part}</Fragment>;
        }

        // 2. Check for self-closing tags: <key/>
        const selfClosingMatch = part.match(/^<(\w+)\s*\/>$/);
        if (selfClosingMatch) {
          const key = selfClosingMatch[1];
          const value = allValues[key];
          if (value !== undefined && typeof value !== 'function') {
            return <Fragment key={index}>{value}</Fragment>;
          }
        }

        // 3. Check for standard variables: {key}
        const varMatch = part.match(/^\{(\w+)\}$/);
        if (varMatch) {
          const key = varMatch[1];
          const value = allValues[key];
          if (value !== undefined && typeof value !== 'function') {
            return <Fragment key={index}>{value}</Fragment>;
          }
        }

        // 4. Standard text or unmatched regex parts
        return <Fragment key={index}>{part}</Fragment>;
      })}
    </span>
  );
});
