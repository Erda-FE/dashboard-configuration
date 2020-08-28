import * as React from 'react';

const IF = ({ children, check }: any) => {
  if (!children) return null;
  const bool = typeof check === 'function' ? check() : check;

  if (React.Children.count(children) === 1) {
    return bool ? children : null;
  }
  const ifSection = [] as any;
  const elseSection = [] as any;
  let hasElse = false;
  React.Children.forEach(children, (child) => {
    if (child.type && child.type.displayName === 'ELSE') {
      hasElse = true;
    }
    if (hasElse) {
      elseSection.push(child);
    } else {
      ifSection.push(child);
    }
  });
  if (bool) {
    return (
      <React.Fragment>{...ifSection}</React.Fragment>
    );
  } else if (hasElse) {
    return (
      <React.Fragment>{...elseSection}</React.Fragment>
    );
  }
  return null;
};

IF.ELSE = ELSE;

function ELSE() {
  return null;
}

ELSE.displayName = 'ELSE';

export { IF };
