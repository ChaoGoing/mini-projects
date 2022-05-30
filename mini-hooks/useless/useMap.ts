const useMap = initialValue => {
    const [map, setMap] = React.useState(new Map(initialValue));
  
    const actions = React.useMemo(
      () => ({
        // 不管set还是remove, 都重新渲染新的map
        set: (key, value) =>
          setMap(prevMap => {
            const nextMap = new Map(prevMap);
            nextMap.set(key, value);
            return nextMap;
          }),
        remove: (key, value) =>
          setMap(prevMap => {
            const nextMap = new Map(prevMap);
            nextMap.delete(key, value);
            return nextMap;
          }),
        clear: () => setMap(new Map()),
      }),
      [setMap]
    );
  
    return [map, actions];
  };