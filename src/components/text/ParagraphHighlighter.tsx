import { useMemo } from 'react';

type HighlightTextProps = {
  /**
   * The text to highlight within
   */
  text: string;
  /**
   * The highlights to search for in the text
   */
  highlights: string[];
  /**
   * Optional class name for the text container
   */
  className?: string;
  /**
   * Optional class name for the highlighted text
   */
  highlightClassName?: string;
} & ElementProps<HTMLSpanElement>;

export const ParagraphHighlighter: React.FC<HighlightTextProps> = ({
  text,
  highlights,
  highlightClassName,
  className,
  ...props
}) => {
  const { regex, parts } = useMemo(() => {
    if (!text || !highlights.length) {
      return { regex: null, parts: [text] };
    }

    // Escape regex special characters in highlights
    const escapedHighlights = highlights.map((highlight) => highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

    // Create a regex to match all highlights
    const regex = new RegExp(`(${escapedHighlights.join('|')})`, 'gi');

    // Split the text based on the regex and wrap matches
    const parts = text.split(regex);

    return { regex, parts };
  }, [text, highlights]);

  if (!regex || !highlights.length) return <span {...props}>{text}</span>;

  return (
    <span>
      {parts.map((part, index) =>
        regex.test(part) ? (
          // biome-ignore lint/suspicious/noArrayIndexKey: there's no other unique identifier
          <span key={index} className={highlightClassName ?? 'highlight'}>
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </span>
  );
};
