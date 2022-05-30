import React, { useRef, useEffect, useState } from "react";


// 待测试： 可能会重复添加滚动事件？
const useWindowSize = (resizeEvent) => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    const handleResize = () => {
      resizeEvent?.()
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [resizeEvent]);

  return windowSize;
};
