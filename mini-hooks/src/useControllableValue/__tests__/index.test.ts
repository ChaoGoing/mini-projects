import { act, renderHook } from "@testing-library/react";
describe("useControllableValue", () => {
  const setUp = (props?: Props, options?: Options<any>): any =>
    renderHook(() => useControllableValue(props, options));

  it("defaultValue should work", () => {
    const hook = setUp({ defaultValue: 1 });
    expect(hook.result.current[0]).toEqual(1);
  });

  it("value should work", () => {
    const hook = setUp({ defaultValue: 1, value: 2 });
    expect(hook.result.current[0]).toEqual(2);
  });
});
