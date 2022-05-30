const useMergeState = (initialState = {}) => {
    const [value, setValue] = React.useState(initialState);
  
    const mergeState = newState => {
      if (typeof newState === 'function') newState = newState(value);
      setValue({ ...value, ...newState });
    };
  
    return [value, mergeState];
  };