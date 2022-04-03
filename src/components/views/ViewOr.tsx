type ViewOrProps = {
  children: [any, any];
  orCondition?: boolean;
};

export function ViewOr({ orCondition = false, children }: ViewOrProps) {
  return orCondition ? <>{children[0]}</> : <>{children[1]}</>;
}
