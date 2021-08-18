import { renderHook, act } from '@testing-library/react-hooks';
import { useState } from 'react';
import useCreation from '../index';

describe('useCreation', () => {

  class Foo{
    data: number;
    constructor() {
      this.data = Math.random()
    }
  }
  
  const setUp = ():any => {
    return renderHook(() => {
      const [count, setCount] = useState(0)
      const [, setFlag] = useState({})
      const foo = useCreation(() => new Foo(), [count])
      return {
        foo,
        setCount,
        count,
        setFlag
      }
    })
  }

  it('basic work', () => {
    const hook = setUp()
    const { foo } = hook.result.current
    console.log(hook)
    act(() => {
      hook.result.current.setFlag({})
    })
    expect(hook.result.current.foo).toBe(foo)
  })
})

