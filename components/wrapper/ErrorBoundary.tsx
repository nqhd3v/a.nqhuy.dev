import React from "react"

class ErrorBoundary extends React.Component<any, { error: boolean }> {
  constructor(props: any) {
    super(props)

    // Define a state variable to track whether is an error or not
    this.state = {
      error: false,
    }
  }
  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI
    console.error('[ERROR-WRAPPER]:', error);

    return { error: true }
  }
  componentDidCatch(error: any, errorInfo: any) {
    console.error('Error when render data:', { error, errorInfo }, this.props.children)
  }
  render() {
    if (this.state.error) {
      return (
        <div className="w-full min-h-[50px] flex justify-center items-center border border-dark dark:border-gray-600">
          <div className="code comment">Unexpected error happened when displaying your view!</div>
        </div>
      )
    }

    return this.props.children
  }
}

export const withBoundary = <T extends object>(Component: React.FunctionComponent<T>) => {
  class ComponentWithBoundary extends React.Component<T> {
    static displayName = Component.name;
    render() {
      return (
        <ErrorBoundary>
          <Component {...this.props as T} />
        </ErrorBoundary>
      )
    }
  }
  
  return ComponentWithBoundary;
}

export default ErrorBoundary