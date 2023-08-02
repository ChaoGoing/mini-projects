import React from "react";
function composeProviders(...providers) {
  return ({ children }) =>
    providers.reduce((prev, Provider) => <Provider>{prev}</Provider>, children);
}

/**
 * 
  const StateProviders = composeProviders(
    LogProvider,
    UserProvider,
    MenuProvider,
    AppProvider,
  )

  function App() {
    return (
      <StateProvider>
        <Main />
      </StateProvider>
    )
  }
*/
