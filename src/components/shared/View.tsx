type ViewProps = {
  children: any;
};

export function View({ children }: ViewProps) {
  return <>{children}</>;
}

type ViewIfProps = {
  children: any;
  isVisible?: boolean;
};

export function ViewIf({ isVisible = false, children }: ViewIfProps) {
  return isVisible ? <>{children}</> : <></>;
}

type ViewOrProps = {
  children: [any, any];
  orCondition?: boolean;
};

export function ViewOr({ orCondition = false, children }: ViewOrProps) {
  return orCondition ? <>{children[0]}</> : <>{children[1]}</>;
}

type ViewSwitchProps = {
  cases: boolean[];
  children: any;
};

export function ViewSwitch({ cases, children }: ViewSwitchProps) {
  if (cases.length > 5) {
    throw Error('ViewSwitch only supports up to 5 cases');
  }

  if (cases[0] && children[0]) {
    return children[0];
  }

  if (cases[1] && children[1]) {
    return children[1];
  }

  if (cases[2] && children[2]) {
    return children[2];
  }

  if (cases[3] && children[3]) {
    return children[3];
  }

  if (cases[4] && children[4]) {
    return children[4];
  }
  console.warn('Rendering all children in the ViewSwitch');
  return children;
}
