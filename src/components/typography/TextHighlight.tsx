type TextHighlightProps = {
  children: any;
};

export function TextHighlight({ children }: TextHighlightProps) {
  return <span className="text-highlight">{children}</span>;
}
