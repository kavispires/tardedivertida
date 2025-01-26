import { useMemo } from 'react';

type HighlightTextProps = {
  text: string;
  highlights: string[];
  className?: string;
  highlightClassName?: string;
} & ElementProps<HTMLSpanElement>;

export const ParagraphHighlighter: React.FC<HighlightTextProps> = ({
  text,
  highlights,
  highlightClassName,
  className,
  ...props
}) => {
  if (!highlights.length) return <span {...props}>{text}</span>;

  const { regex, parts } = useMemo(() => {
    // Escape regex special characters in highlights
    const escapedHighlights = highlights.map((highlight) => highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

    // Create a regex to match all highlights
    const regex = new RegExp(`(${escapedHighlights.join('|')})`, 'gi');

    // Split the text based on the regex and wrap matches
    const parts = text.split(regex);

    return { regex, parts };
  }, [text, highlights]);

  return (
    <span>
      {parts.map((part, index) =>
        regex.test(part) ? (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
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
