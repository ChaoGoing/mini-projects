import React, { useRef, useEffect, useState } from "react";

const usePersistedState = (name, defaultValue) => {
  const [value, setValue] = useState(() => {
    try {
      const value = localStorage.getItem(name);

      if (value) {
        return JSON.parse(value);
      } else {
        localStorage.setItem(name, JSON.stringify(defaultValue));
        return defaultValue;
      }
    } catch (err) {
      return defaultValue;
    }
  });
  const nameRef = useRef(name);

  useEffect(() => {
    try {
      localStorage.setItem(nameRef.current, value);
    } catch {}
  }, [value]);

  useEffect(() => {
    const lastName = nameRef.current;
    if (name !== lastName) {
      try {
        localStorage.setItem(name, value);
        nameRef.current = name;
        localStorage.removeItem(lastName);
      } catch {}
    }
  }, [name]);

  return [value, setValue];
};
export default usePersistedState;
