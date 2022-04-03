type ViewIfProps = {
  children: any;
  isVisible?: boolean;
};

export function ViewIf({ isVisible = false, children }: ViewIfProps) {
  return isVisible ? <>{children}</> : <></>;
}
