import React from 'react'

import { useCSSThemePostfix } from '../../hooks/useCSSThemePostfix'
import { ErrorBoundary } from './ErrorBoundary'

//High order component to enable useCSSTheme custom hook in class ErrorBoundary component
export function ErrorBoundaryWithCSSThemePostfixHook(props: { children: React.ReactNode }) {
  const { classNames } = useCSSThemePostfix()
  return <ErrorBoundary {...props} myCSSHookFunction={classNames} />
}

//TODO: to make function generic! (figure out Typescript typings)
// https://stackoverflow.com/questions/53371356/how-can-i-use-react-hooks-in-react-classic-class-component
/* function withMyHook(Component) {
  return function WrappedComponent(props) {
    const myHookValue = useMyHook();
    return <Component {...props} myHookValue={myHookValue} />;
  }
}
While this isn't truly using a hook directly from a class component, this will at least allow you to use the logic of your hook from a class component, without refactoring.

class MyComponent extends React.Component {
  render(){
    const myHookValue = this.props.myHookValue;
    return <div>{myHookValue}</div>;
  }
}

export default withMyHook(MyComponent); */
