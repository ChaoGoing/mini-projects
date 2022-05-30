// Creates a stateful value, returning a getter and a setter function.
const useGetSet = (initialState) => {
  const state = React.useRef(initialState);
  const [, update] = React.useReducer(() => ({}));

  return React.useMemo(
    () => [
      () => state.current,
      (newState) => {
        state.current = newState;
        update();
      },
    ],
    []
  );
};
