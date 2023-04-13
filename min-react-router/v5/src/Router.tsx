import React, { useEffect, useState } from 'react';
import { history, Location } from './histroy';
interface RouterContextProps {
  history: typeof history;
  location: Location;
}
export const RouterContext = React.createContext<RouterContextProps | null>(
  null,
);

export function Router({ children }: any) {
  const [location, setLocation] = useState(history.location);
  // 初始化的时候 订阅 history 的变化
  // 一旦路由发生改变 就会通知使用了 useContext(RouterContext) 的子组件去重新渲染
  useEffect(() => {
    const unlisten = history.listen(location => {
      setLocation(location);
    });
    return unlisten;
  }, []);

  return (
    <RouterContext.Provider value={{ history, location }}>
      {children}
    </RouterContext.Provider>
  );
}
